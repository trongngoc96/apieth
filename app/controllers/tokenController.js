const ERC20ABI = require('../../configs/abi/erc20.json')
const http = require('http-status-codes');
const response = require('../common/respone.json');
const tokenServices = require('../services/tokenServices');
const ethGateWay = require('../blockchain/eth/ethGateWay');
const authServices = require('../services/authServices');
const logger = require('../../logs/winston');
const kue = require('kue')
    , queue = kue.createQueue();
module.exports = ({
    classname: 'tokenController',

    create: async (req, res) => {
        try {
            const initialsupply = req.body.initialsupply;
            const tokenname = req.body.tokenname;
            const tokensymbol = req.body.tokensymbol;
            const retry = req.body.check ? req.body.check : 0;
            const job = queue.create('deployed', {
                retry: retry,
                initialsupply: initialsupply,
                tokenname: tokenname,
                tokensymbol: tokensymbol
            })
                .removeOnComplete(true)
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
                    return res.status(http.OK).send(
                        response[0]
                    )
                });
        } catch (err) {
            logger.error("FUNC: create token ", err);
            return res.status(http.INTERNAL_SERVER_ERROR).send(
                response[3]
            )
        }
    },

    getBalance: async (req, res) => {
        try {
            const addressToken = req.query.addresstoken;
            const addressUser = req.query.addressuser;
            const data = {
                "addressUser": addressUser,
                "addressToken": addressToken
            }
            const result = await tokenServices.getBalance(data)
            res.json(result)
        } catch (err) {
            logger.error("FUNC: get balance token ", err);
            res.json(err);
        }
    },

    transfer: async (req, res) => {
        try {
            const to = req.body.to;
            const amount = req.body.amount;
            const addressToken = req.body.addresstoken;
            const passwordWallet = req.body.passwordwallet;
            const findUser = await authServices.login({ 'id': req.decoded.user.id });
            const web3 = ethGateWay.getLib();
            const keystore = findUser.result.keystore;
            const account = await web3.eth.accounts.decrypt(keystore, passwordWallet);
            const data = {
                "to": to,
                "amount": amount,
                "addressToken": addressToken,
                "account": account
            }
            const result = await tokenServices.transfer(data)
            res.json(result)
        } catch (err) {
            logger.error("FUNC: transfer token ", err);
            res.json(err);
        }
    }
})