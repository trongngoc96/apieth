const ERC20ABI = require('../../configs/abi/erc20.json')
const http = require('http-status-codes');
const response = require('../common/respone.json');
const Const = require("../common/Const");
const tokenServices = require('../services/tokenServices');
const ethGateWay = require('../blockchain/eth/ethGateWay');
const authServices = require('../services/authServices');
const logger = require('../../logs/winston');
const BigNumber = require('bignumber.js');
const { validationResult } = require('express-validator');
const kue = require('kue')
    , queue = kue.createQueue();
module.exports = ({
    classname: 'tokenController',

    create: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const initialsupply = req.body.initialsupply;
            const tokenname = req.body.tokenname;
            const balance = new BigNumber(initialsupply*Const.DECIMAL.toString());
            const tokensymbol = req.body.tokensymbol;
            const passwordWallet = req.body.passwordwallet;
            const findUser = await authServices.login({ 'id': req.decoded.user.id });
            const web3 = ethGateWay.getLib();
            const keystore = findUser.data.keystore;
            const account = await web3.eth.accounts.decrypt(keystore, passwordWallet);
            const job = queue.create('deployed', {
                initialsupply: balance,
                tokenname: tokenname,
                tokensymbol: tokensymbol,
                account: account
            })
                .removeOnComplete(true).attempts(5)
                .save((err) => {
                    if (err) {
                        console('error');
                        return;
                    }
                    job.on('complete', (result) => {
                        console.log(`Hello Intense ${result}`);
                    });
                    job.on('failed', () => {
                        console.log('error');
                    });
                    return res.status(201).send({
                        "statusCode": 201,
                        "message": "Created. Please wait a few minutes",
                    })
                });
        } catch (error) {
            logger.error("FUNC: create token ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },

    getBalance: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const addressToken = req.query.addresstoken;
            const addressUser = req.query.addressuser;
            const data = {
                "addressUser": addressUser,
                "addressToken": addressToken
            }
            const result = await tokenServices.getBalance(data)
            return res.status(200).send(result)
        } catch (error) {
            logger.error("FUNC: get balance token ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },

    transfer: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const to = req.body.to;
            const amount = req.body.amount;
            const balance = new BigNumber(amount*1e18.toString());
            const addressToken = req.body.addresstoken;
            const passwordWallet = req.body.passwordwallet;
            const findUser = await authServices.login({ 'id': req.decoded.user.id });
            const web3 = ethGateWay.getLib();
            const keystore = findUser.data.keystore;
            const account = await web3.eth.accounts.decrypt(keystore, passwordWallet);
            const data = {
                "to": to,
                "amount": balance,
                "addressToken": addressToken,
                "account": account
            }
            const result = await tokenServices.transfer(data)
            return res.status(200).send(result)
        } catch (error) {
            logger.error("FUNC: transfer token ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },

    getToken: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const status = req.query.status
            const token = await tokenServices.findAll({"status": status})
            return res.status(200).send(token)
        } catch (error) {
            logger.error("FUNC: get history ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },

    tokenMint: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const amount = req.body.amount;
            const balance = new BigNumber(amount*1e18.toString());
            const addressToken = req.body.addresstoken;
            const passwordWallet = req.body.passwordwallet;
            const findUser = await authServices.login({ 'id': req.decoded.user.id });
            const web3 = ethGateWay.getLib();
            const keystore = findUser.data.keystore;
            const account = await web3.eth.accounts.decrypt(keystore, passwordWallet);
            const data = {
                "amount": balance,
                "addressToken": addressToken,
                "account": account
            }
            const result = await tokenServices.tokenMint(data)
            return res.status(200).send(result)
        } catch (error) {
            logger.error("FUNC: transfer token ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },

    tokenBurn: async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const amount = req.body.amount;
            const balance = new BigNumber(amount*1e18.toString());
            const addressToken = req.body.addresstoken;
            const passwordWallet = req.body.passwordwallet;
            const findUser = await authServices.login({ 'id': req.decoded.user.id });
            const web3 = ethGateWay.getLib();
            const keystore = findUser.data.keystore;
            const account = await web3.eth.accounts.decrypt(keystore, passwordWallet);
            const data = {
                "amount": balance,
                "addressToken": addressToken,
                "account": account
            }
            const result = await tokenServices.tokenBurn(data)
            return res.status(200).send(result)
        } catch (error) {
            logger.error("FUNC: transfer token ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    },
})