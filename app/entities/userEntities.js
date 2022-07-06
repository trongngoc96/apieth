const UserModel = require('../models/users');
module.exports = ({

    findOrCreate: async(data, dataInsert) => {
        try {
            let users = await UserModel.findOrCreate({
                where: data,
                defaults: dataInsert
            });
            return JSON.stringify(users, null, 4)
        } catch (error) {
            return JSON.stringify({
                "error": error
            })
        }
    },

    findOne: async(data) => {
        try {
            let users = await UserModel.findOne({
                where: data
            })
            return JSON.stringify(users, null, 4)
        } catch (error) {
            return error;
        }
    },

    findAll: async () => {
        try {
            let result = await UserModel.findAll({
                where: dataFind
            })
            return JSON.stringify(result, null, 4)
        } catch (error) {
            return error;
        }
    },

    createRecordUser:async(data) => {
        try {
            const result = await UserModel.create(data);
            return JSON.stringify(result, null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    }


})