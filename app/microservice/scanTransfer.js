require('dotenv').config();
const web3 = require('../blockchain/eth/ethGateWay').getLib();
const cron = require('node-cron');
const historyEntities = require('../entities/historyEntities')
const logger = require('../../logs/winston');

function eventTransfer() {
    try {
        web3.eth.getPastLogs({
            fromBlock: "12568721",
            toBlock: "12568726",
            topics: [web3.utils.sha3('Transfer(address,address,uint256)')]
        }, async function (error, result) {
            if (!error) {
                await Promise.all(result.map(async (el) => {
                    
                    const findOne = await historyEntities.findOne({ where: { "tx_id": el.transactionHash } });
                    if (findOne) {
                        await historyEntities.update({
                            "block_number": el.blockNumber,
                            "block_hash": el.blockHash,
                            "tx_raw": el.data,
                            "status": true 
                        }, {"tx_id" : el.transactionHash})

                    }
                }))
            } else {
                logger.error("Event Transfer: " + error);
                throw new Error(error.message)
            }
        });
    } catch (error) {
        logger.error("Event Transfer: " + error);
        throw new Error(error.message)
    }
}
// cron.schedule('*/5 * * * *', async () => {
    eventTransfer();
// })