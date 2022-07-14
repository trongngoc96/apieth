const historyEntities = require('../entities/historyEntities');

module.exports = ({
    classname: 'historyServices',

    findAll: async (data) => {
        try {
            removeUnderfined = JSON.parse(JSON.stringify(data))
            const result = await historyEntities.findAll(removeUnderfined);
            return {
                "statusCode": 200,
                "data": JSON.parse(result)
            }
        } catch (err) {
            logger.error("find all: " + error)
            throw error
        }
    }
})