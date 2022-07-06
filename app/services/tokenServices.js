const tokenEntities = require('../entities/tokenEntities');
const ERC20ABI = require('../../configs/abi/erc20.json')
const ethGateWay = require('../blockchain/eth/ethGateWay');
const util = require('util');

module.exports = ({
    classname: "tokenServices",

    create: async (data) => {
        const result = await tokenEntities.create(data);
        if (JSON.parse(result).error) {
            return JSON.parse(result).error;
        }

        return {
            "result": JSON.parse(result)
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
    }
})