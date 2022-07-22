const latestEntities = require('../entities/latestEntities');
const logger = require('../../logs/winston');
module.exports = ({
    classname: 'latestServices',
    
    findOne: async (data) => {
        try {
            const result = await latestEntities.findOne(data);
            return {
                "message": "Success",
                "statusCode": 200,
                "data": JSON.parse(result)
            };
        } catch (error) {
            logger.error("find one latest: " + error)
            throw error
        }
    },

    update: async (data, dataFind) => {
        try {
            const result = await latestEntities.update(data, dataFind);
            return JSON.stringify(result[0], null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },

    create: async (data) => {
        try {
            const result = await latestEntities.create(data);
            return JSON.stringify(result, null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },
})