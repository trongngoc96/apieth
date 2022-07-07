const tokenEntities = require('../entities/tokenEntities');
const ERC20ABI = require('../../configs/abi/erc20.json')
const historyEntities = require('../entities/historyEntities');
const ethGateWay = require('../blockchain/eth/ethGateWay');
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
            return result;
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
            const result = await historyEntities.create({ "address_token": data.addressToken, "from": data.account.address, "to": data.to, "tx_id": resultCallContract, "amount": (data.amount)/1e18 });
            return {
                "result": JSON.parse(result)
            }
        } catch (error) {
            logger.error("transfer token: " + error)
            throw error
        }
    },
})