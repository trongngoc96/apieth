require('dotenv').config();
const ERC20ABI = require('../../configs/abi/erc20.json');
const historyEntities = require('../entities/historyEntities');
const logger = require('../../logs/winston');

var Web3 = require('web3');
var PROVIDER_WSS = process.env.ETH_NETWORK_PROVIDER_WS;
var provider = new Web3.providers.WebsocketProvider(PROVIDER_WSS);
var web3 = new Web3(provider);

provider.on('error', e => {
    console.error('WS Infura Error', e);
});

provider.on('end', e => {
    console.log('WS closed');
    console.log('Attempting to reconnect...');
    provider = new Web3.providers.WebsocketProvider(PROVIDER_WSS);
    provider.on('connect', function () {
        console.log('WSS Reconnected');
    });
    web3.setProvider(provider);
});

async function run() {
    const history = await historyEntities.findAll();
    const arrHistory = JSON.parse(history);
    arrHistory.forEach(element => {
        const myContract = new web3.eth.Contract(ERC20ABI, element.address_token);
        myContract.events.Transfer({
          
        }).on('data', async function (event) {
            // console.log(event.returnValues.postId);
            const data = {
                "block_number": event.blockNumber,
                "block_hash": event.blockHash,
                "tx_raw": event.raw.data,
                "status": true
            }
            const dataFind = {
                "tx_id": event.transactionHash
            }
            const updateHistory = await historyEntities.update(data, dataFind);
            console.log("Success", updateHistory);      
        }).on('error', console.error);
    });
}

run();
