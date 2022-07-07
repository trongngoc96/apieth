const UserEntities = require('../entities/userEntities');
const logger = require('../../logs/winston');
module.exports = ({
    classname: 'authServices',
    
    register: async (dataFind, dataInsert) => {
        try {
            await UserEntities.findOrCreate(dataFind, dataInsert);
            return {
                "message": "Success",
            };
        } catch (error) {
            logger.error("register: " + error)
            throw error
        }
    },

    login: async (data) => {
        try {
            const result = await UserEntities.findOne(data);
            if (!result) {
                const error = new Error("Account does not exist");
                error.statusCode = 404;
                throw error;
            } else {
                return {
                    "message": "Success",
                    "data": JSON.parse(result)
                };
            }
        } catch (error) {
            logger.error("login: " + error)
            throw error
        }
    },
})