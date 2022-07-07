const jwt = require('jsonwebtoken');
const Const = require('../common/Const');
const authServices = require('../services/authServices');
const ethGateWay = require('../blockchain/eth/ethGateWay');
const bcrypt = require('bcrypt');
const http = require('http-status-codes');
const response = require('../common/respone.json');
const logger = require('../../logs/winston');

const { validationResult } = require('express-validator');

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

    login: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const email = req.body.email;
            const password = req.body.password;
            const result = await authServices.login({ "email": email })
            const compare = await bcrypt.compare(password, result.data.password)
            if (compare == true) {
                const token = generateAccesstoken({ "email": result.data.email, "id": result.data.id })
                let data = {};
                data.token = token;
                data.passwordWallet = result.data.passwordWallet;
                console.log(data)
                return res.status(200).send(data)
            } else {
                const error = new Error("Account does not exist!");
                error.statusCode = 404;
                throw error;
            }
        } catch (error) {
            logger.error("FUNC: login ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },

    register: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const web3 = ethGateWay.getLib();
            const email = req.body.email;
            const password = req.body.password;
            const repeatPassword = req.body.repeatpassword;
            const passwordWallet = req.body.passwordwallet;
            const userName = req.body.username;
            const account = web3.eth.accounts.create();
            const error = validationResult(req);
            const privateKey = account.privateKey.toString();
            const address = account.address.toString();
            const keystore = web3.eth.accounts.encrypt(privateKey, passwordWallet);

            const result = await authServices.register({ "email": email },
                { "email": email, "password": await bcrypt.hash(password, 12), "username": userName, "keystore": JSON.stringify(keystore), "address": address, "passwordWallet": passwordWallet })
            return res.status(200).send(result); 
        } catch (error) {
            logger.error("FUNC: register ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

})