require('dotenv').config();
const web3 = require('../blockchain/eth/ethGateWay').getLib();
const cron = require('node-cron');
const ethEntities = require('../entities/ethEntities')
const ethGateWay = require('../blockchain/eth/ethGateWay');
const logger = require('../../logs/winston');

async function crawlTransfer() {
    try {
        const findEthHistory = await ethEntities.findAll({ "status": 0 });
        const result = JSON.parse(findEthHistory);
        if (result.length != 0) {
            await Promise.all(result.map(async (el) => {
                if(el.status == 0) {
                    const txData = await ethGateWay.getTransaction(el.tx_id)
                    console.log(txData)
                    await ethEntities.update({
                        "block_number": txData.blockNumber,
                        "block_hash": txData.blockHash,
                        "tx_raw": '0x0',
                        "status": true
                    }, { "tx_id": txData.hash })
                }
            }))
        }
    } catch (error) {
        logger.error("Event Transfer: " + error);
        throw new Error(error.message)
    }
}
// cron.schedule('*/5 * * * *', async () => {
crawlTransfer();
// })