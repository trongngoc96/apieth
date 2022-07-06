const jwt = require('jsonwebtoken');
const Const = require('../common/Const');
const authServices = require('../services/authServices');
const ethGateWay = require('../blockchain/eth/ethGateWay');
const bcrypt = require('bcrypt');
const http = require('http-status-codes');
const response = require('../common/respone.json');
const logger = require('../../logs/winston');

const { check, body, validationResult } = require('express-validator')

const expiredTime = process.env.EXPIREDTIME || Const.DAY_IN_MILLISECONDS / 1000 * 30;

function generateAccesstoken(user) {
    const token = jwt.sign({
        user: user
    }, process.env.JWT_SECRET, {
        // expiresIn: expiredTime
    });
    return token
}

module.exports = ({
    classname: 'AuthController',

    refreshToken: (user) => {
        const token = jwt.sign(user, process.env.SECRETREFRESH, {
            expiresIn: expiredTime,
        });
        return token
    },

    login: async (req, res) => {
        try {
            const email = req.body.email;
            const password = req.body.password;
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return res.status(404).send({
                    status_code: 404,
                    status_message: 'email or password null',
                    oldInput: {
                        email: email,
                        password: password
                    },
                    validationErrors: error.array()
                });
            }
            const result = await authServices.login({ "email": email })
            if (result.result == null) {
                let data = {};
                data.status = response[3];
                return res.status(http.INTERNAL_SERVER_ERROR).send(data)
            }
            const compare = await bcrypt.compare(password, result.result.password)
            if (compare == true) {
                const token = generateAccesstoken({ "email": result.result.email, "id": result.result.id })
                let data = {};
                data.status = response[0];
                data.token = token;
                data.passwordWallet = result.result.passwordWallet;
                console.log(data)
                return res.status(http.OK).send(data)
            } else {
                let data = {};
                data.status = response[3];

                return res.status(http.INTERNAL_SERVER_ERROR).send(data)
            }
        } catch (err) {
            let data = {};
            data.status = response[3];
            logger.error("FUNC: login ", err);
            return res.status(http.INTERNAL_SERVER_ERROR).send(data)
        }
    },

    register: async (req, res) => {
        try {
            const web3 = ethGateWay.getLib();
            const email = req.body.email;
            const password = req.body.password;
            const repeatPassword = req.body.repeatPassword;
            const passwordWallet = req.body.passwordWallet;
            const userName = req.body.userName;
            const account = web3.eth.accounts.create();
            const error = validationResult(req);
            const privateKey = account.privateKey.toString();
            const address = account.address.toString();
            const keystore = web3.eth.accounts.encrypt(privateKey, passwordWallet);
            if (!error.isEmpty()) {
                return res.status(http.BAD_REQUEST).send(Object.assign(response[1], {
                    oldInput: {
                        email: email,
                        password: password,
                        repeatPassword: repeatPassword
                    },
                    validationErrors: error.array()
                }));
            }

            const result = await authServices.register({ "email": email },
                { "email": email, "password": await bcrypt.hash(password, 12), "username": userName, "keystore": JSON.stringify(keystore), "address": address, "passwordWallet": passwordWallet })
            if (result.result[1] == true) {
                return res.status(http.OK).send(response[0])
            } else {
                return res.status(http.BAD_REQUEST).send(response[1])
            }
        } catch (err) {
            logger.error("FUNC: register ", err);
            return res.status(http.INTERNAL_SERVER_ERROR).send(response[3])
        }
    }

})