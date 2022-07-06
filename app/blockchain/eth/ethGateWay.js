const ERC20ABI = require('../../../configs/abi/erc20.json');
const logger = require('../../../logs/winston');
const httpProviders = {
    development: process.env.ETH_NETWORK_PROVIDER,
};

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(httpProviders[process.env.NODE_ENV]));

module.exports = ({
    classname: "ethGateWay",

    getLib: () => {
        return web3;
    },

    getContract: (data) => {
        return new web3.eth.Contract(ERC20ABI, data.addressToken);
    },

    callContract: async (data, callback) => {
        try {
            const resultSignTransaction = await web3.eth.accounts.signTransaction({
                from: data.account.address,
                nonce: web3.eth.getTransactionCount(data.account.address, 'pending'),
                to: data.addressToken,
                value: '0x0',
                data: data.data,
                gasPrice: web3.utils.toHex(100000000),
                gas: web3.utils.toHex(3600000),
            }, data.account.privateKey)
            web3.eth.sendSignedTransaction(resultSignTransaction.rawTransaction)
            .on('transactionHash', async function(hash){
            
                return callback(null, hash);
            })
        } catch (error) {
            logger.error("FUNC: callContract ", error);
            return error;
        }
    }
})