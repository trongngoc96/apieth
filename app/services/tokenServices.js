const tokenEntities = require('../entities/tokenEntities');
const ERC20ABI = require('../../configs/abi/erc20.json')
const historyEntities = require('../entities/historyEntities');
const ethGateWay = require('../blockchain/eth/ethGateWay');
const util = require('util');
const callContract = util.promisify(ethGateWay.callContract)

module.exports = ({
    classname: "tokenServices",

    create: async (data) => {
        try {
            const result = await tokenEntities.create(data);
            if (JSON.parse(result).error) {
                return JSON.parse(result).error;
            }
            return {
                "result": JSON.parse(result)
            }
        } catch (error) {
            return error;
        }
    },

    getBalance: async (data) => {
        try {
            const web3 = ethGateWay.getLib();
            const contract = new web3.eth.Contract(ERC20ABI, data.addressToken);
            const result = await contract.methods.balanceOf(data.addressUser).call();
            return result;
        } catch (err) {
            return err;
        }
    },

    transfer: async (data) => {
        try {
            console.log('jjjjjjjjj')
            const contract = ethGateWay.getContract(data);
            data.data = contract.methods.transfer(data.to, data.amount).encodeABI();
            const resultCallContract = await callContract(data);
            console.log(resultCallContract)
            const result = await historyEntities.create({ "address_token": data.addressToken, "from": data.account.address, "to": data.to, "tx_id": resultCallContract, "amount": (data.amount)/1e18 });
            if (JSON.parse(result).error) {
                return JSON.parse(result).error;
            }

            return {
                "result": JSON.parse(result)
            }
        } catch (error) {
            return error;
        }
    },
})