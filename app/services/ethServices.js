const tokenEntities = require('../entities/tokenEntities');
const ERC20ABI = require('../../configs/abi/erc20.json')
const ethEntities = require('../entities/ethEntities');
const ethGateWay = require('../blockchain/eth/ethGateWay');
const Const = require('../common/Const')
const logger = require('../../logs/winston');
const util = require('util');
const callContract = util.promisify(ethGateWay.callContract)

module.exports = ({
    classname: "ethServices",

    sendEth: async (data) => {
        try {
            const web3 = ethGateWay.getLib();
            const balanceOfFrAddress = await web3.eth.getBalance(data.account.address);
            if (balanceOfFrAddress < data.amount.toNumber()) {
                const error =  new Error("Balance of ETH insufficient");
                error.statusCode = 443;
                throw error;
            }
            const dataRaw = {
                "to": data.to,
                "account": data.account,
                "amount": data.amount,
                "type": "eth",
                "data": null
            }
            const resultCallContract = await callContract(dataRaw);
            const result = await ethEntities.create({"from": data.account.address, "to": data.to, "tx_id": resultCallContract, "amount": data.amount });
            return {
                "message": "Success",
                "statusCode": 200,
                "data": resultCallContract
            };
        } catch (error) {
            logger.error("Send Eth: "+ error)
            throw error
        }

    },

    findAll: async (data) => {
        try {
            removeUnderfined = JSON.parse(JSON.stringify(data))
            const result = await ethEntities.findAll(removeUnderfined);
            return {
                "statusCode": 200,
                "data": JSON.parse(result)
            }
        } catch (error) {
            logger.error("find all: " + error)
            throw error
        }
    },
})