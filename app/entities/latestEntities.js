const latestModel = require('../models/latest');
const Sequelize = require('sequelize');
const sequelize = require('../../configs/connect/database');

module.exports = ({
    classname: "latestEntities",

    findOne: async (data) => {
        try {
            let result = await latestModel.findOne({
                where: data
            })
            return JSON.stringify(result, null, 4)
        } catch (error) {
            return error;
        }
    },

    update: async (data, dataFind) => {
        try {
            const result = await latestModel.update(data, {
                where: dataFind
            });
            return JSON.stringify(result[0], null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },

    create: async (data) => {
        try {
            const result = await latestModel.create(data);
            return JSON.stringify(result, null, 4);
        } catch(err) {
            return JSON.stringify({
                "error": err
            })
        }
    },
})