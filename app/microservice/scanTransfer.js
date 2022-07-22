require('dotenv').config();
const web3 = require('../blockchain/eth/ethGateWay').getLib();
const cron = require('node-cron');
const historyEntities = require('../entities/historyEntities')
const logger = require('../../logs/winston');
const latestServices = require('../services/latestServices');

async function eventTransfer() {
    try {
        var fromBlock = 0;
        const findLatest = await latestServices.findOne({ "id": 1 });
        if (findLatest.data == null) {
            fromBlock = process.env.FROMBLOCK
            await latestServices.create({"block_number": fromBlock});
        } else {
            fromBlock = findLatest.data.block_number;
        } 
        web3.eth.getPastLogs({
            fromBlock: fromBlock,
            toBlock: "latest",
            topics: [web3.utils.sha3('Transfer(address,address,uint256)')]
        }, async function (error, result) {
            if (!error) {
                await Promise.all(result.map(async (el) => {

                    const findOne = await historyEntities.findOne({ where: { "tx_id": el.transactionHash } });
                    await latestServices.update({"block_number": el.blockNumber}, { "id": 1 });
                    if (findOne) {
                        await historyEntities.update({
                            "block_number": el.blockNumber,
                            "block_hash": el.blockHash,
                            "tx_raw": el.data,
                            "status": true
                        }, { "tx_id": el.transactionHash })

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
cron.schedule('*/5 * * * *', async () => {
eventTransfer();
})