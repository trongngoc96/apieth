const ethModel = require('../models/ethHistorys');
const Sequelize = require('sequelize');
const sequelize = require('../../configs/connect/database');

module.exports = ({
    classname: "ethEntities",

    findOne: async (data) => {
        try {
            let result = await ethModel.findOne({
                where: data
            })
            return JSON.stringify(result, null, 4)
        } catch (error) {
            return error;
        }
    },

    create: async (data) => {
        try {
            const result = await ethModel.create(data);
            return JSON.stringify(result, null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },

    findAll: async (dataFind) => {
        try {
            let result = await ethModel.findAll({
                where: dataFind
            })
            return JSON.stringify(result, null, 4)
        } catch (error) {
            return error;
        }
    },

    update: async (data, dataFind) => {
        try {
            const result = await ethModel.update(data, {
                where: dataFind
            });
            return JSON.stringify(result[0], null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },
})