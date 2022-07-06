const historyModel = require('../models/historys');
const Sequelize = require('sequelize');
const sequelize = require('../../configs/connect/database');

module.exports = ({
    classname: "historyEntities",

    findOne: async (data) => {
        try {
            let result = await historyModel.findOne({
                where: data
            })
            return JSON.stringify(result, null, 4)
        } catch (error) {
            return error;
        }
    },

    create: async (data) => {
        try {
            console.log(data)
            const result = await historyModel.create(data);
            return JSON.stringify(result, null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },

    update: async (data, dataFind) => {
        try {
            const result = await historyModel.update(data, {
                where: dataFind
            });
            return JSON.stringify(result[0], null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },

    findAll: async (dataFind) => {
        try {
            let result = await historyModel.findAll({
                where: dataFind
            })
            return JSON.stringify(result, null, 4)
        } catch (error) {
            return error;
        }
    }

})