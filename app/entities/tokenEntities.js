const tokenModel = require('../models/tokens');
const Sequelize = require('sequelize');
const sequelize = require('../../configs/connect/database');

module.exports = ({
    classname: "tokenEntities",

    findOne: async (data) => {
        try {
            let result = await tokenModel.findOne({
                where: data
            })
            return JSON.stringify(result, null, 4)
        } catch (error) {
            return error;
        }
    },

    create: async (data) => {
        try {
            const result = await tokenModel.create(data);
            return JSON.stringify(result, null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },

    findAll: async (dataFind) => {
        try {
            let result = await tokenModel.findAll({
                where: dataFind
            })
            return JSON.stringify(result, null, 4)
        } catch (error) {
            return error;
        }
    }

})