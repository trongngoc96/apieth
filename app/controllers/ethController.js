const Const = require("../common/Const");
const ethGateWay = require('../blockchain/eth/ethGateWay');
const authServices = require('../services/authServices');
const ethServices = require('../services/ethServices');
const logger = require('../../logs/winston');
const BigNumber = require('bignumber.js');
const { validationResult } = require('express-validator');
module.exports = ({
    classname: 'tokenController',

    sendEth: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const amount = req.body.amount;
            const balance = new BigNumber(amount*Const.DECIMAL.toString());
            const to = req.body.to;
            const passwordWallet = req.body.passwordwallet;
            const findUser = await authServices.login({ 'id': req.decoded.user.id });
            const web3 = ethGateWay.getLib();
            const keystore = findUser.data.keystore;
            const account = await web3.eth.accounts.decrypt(keystore, passwordWallet);
            const data = {
                "amount": balance,
                "to": to,
                "account": account
            }
            const result = await ethServices.sendEth(data);
            return res.status(200).send(result);
            
        } catch (error) {
            logger.error("FUNC: create token ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },

    getHistory: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const from = req.query.from;
            const to = req.query.to;
            const status = req.query.status
            const data = {
                "from": from,
                "to": to,
                "status": status
            }
            const history = await ethServices.findAll(data)
            return res.status(200).send(history)
        } catch (error) {
            logger.error("FUNC: get history ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }
})