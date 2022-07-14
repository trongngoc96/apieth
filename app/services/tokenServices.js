const tokenEntities = require('../entities/tokenEntities');
const ERC20ABI = require('../../configs/abi/erc20.json')
const historyEntities = require('../entities/historyEntities');
const ethGateWay = require('../blockchain/eth/ethGateWay');
const Const = require('../common/Const')
const logger = require('../../logs/winston');
const util = require('util');
const callContract = util.promisify(ethGateWay.callContract)

module.exports = ({
    classname: "tokenServices",

    create: async (data) => {
        try {
            await tokenEntities.create(data);
        } catch (error) {
            logger.error("create token: " + error)
            throw error
        }
    },

    getBalance: async (data) => {
        try {
            const web3 = ethGateWay.getLib();
            const contract = new web3.eth.Contract(ERC20ABI, data.addressToken);
            const result = await contract.methods.balanceOf(data.addressUser).call();
            return {
                "statusCode": 200,
                "balance": result
            }
        } catch (error) {
            logger.error("get balance token: " + error)
            throw error
        }
    },

    transfer: async (data) => {
        try {
            const contract = ethGateWay.getContract(data);
            data.data = contract.methods.transfer(data.to, data.amount).encodeABI();
            const resultCallContract = await callContract(data);
            const result = await historyEntities.create({ "address_token": data.addressToken, "from": data.account.address, "to": data.to, "tx_id": resultCallContract, "amount": (data.amount)/Const.DECIMAL });
            return {
                "statusCode": 200,
                "message": "Success. Please wait a few minutes",
                "data": JSON.parse(result)
            }
        } catch (error) {
            logger.error("transfer token: " + error)
            throw error
        }
    },

    tokenMint: async (data) => {
        try {
            const contract = ethGateWay.getContract(data);
            data.data = contract.methods.mint(data.amount).encodeABI();
            const resultCallContract = await callContract(data);
            //const result = await historyEntities.create({ "address_token": data.addressToken, "from": data.account.address, "to": data.to, "tx_id": resultCallContract, "amount": (data.amount)/Const.DECIMAL });
            return {
                "statusCode": 200,
                "message": "Success. Please wait a few minutes",
            }
        } catch (error) {
            logger.error("Mint token: " + error)
            throw error
        }
    },

    tokenBurn: async (data) => {
        try {
            const contract = ethGateWay.getContract(data);
            data.data = contract.methods.burn(data.amount).encodeABI();
            const resultCallContract = await callContract(data);
            //const result = await historyEntities.create({ "address_token": data.addressToken, "from": data.account.address, "to": data.to, "tx_id": resultCallContract, "amount": (data.amount)/Const.DECIMAL });
            return {
                "statusCode": 200,
                "message": "Success. Please wait a few minutes",
            }
        } catch (error) {
            logger.error("Mint token: " + error)
            throw error
        }
    },

    findAll: async (data) => {
        try {
            removeUnderfined = JSON.parse(JSON.stringify(data))
            const result = await tokenEntities.findAll(removeUnderfined);
            return {
                "statusCode": 200,
                "data": JSON.parse(result)
            }
        } catch (error) {
            logger.error("find all: " + error)
            throw error
        }
    }
})