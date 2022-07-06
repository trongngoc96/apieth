const ERC20ABI = require('../../configs/abi/erc20.json')
const http = require('http-status-codes');
const response = require('../common/respone.json');
const tokenServices = require('../services/tokenServices');
const ethGatway = require('../blockchain/eth/ethGateWay');
const authServices = require('../services/authServices');
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
            return res.status(http.INTERNAL_SERVER_ERROR).send(
                response[3]
            )
        }
    },

    getBalance: async (req, res) => {
        try {
            const addressToken = req.body.addresstoken;
            const addressUser = req.body.addressuser;
            const data = {
                "addressUser": addressUser,
                "addressToken": addressToken
            }
            console.log(data)
            const result = await tokenServices.getBalance(data)
            res.json(result)
        } catch (err) {
            res.json(err);
        }
    },
})