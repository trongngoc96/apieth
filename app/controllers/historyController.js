const historyServices = require('../services/historyServices');
const http = require('http-status-codes');
const response = require('../common/respone.json');
const logger = require('../../logs/winston');

const { check, body, validationResult } = require('express-validator')

module.exports = ({
    classname: 'historyController',

    getHistory: async (req, res) => {
        try {
            const addressToken = req.query.addresstoken;
            const from = req.query.from;
            const to = req.query.to;
            // if(addressToken || from || to) {
            //     const history = await historyServices.findAll()
            // }
            const data = {
                "address_token": addressToken,
                "from": from,
                "to": to
            }
            const history = await historyServices.findAll(data)
            const result = {};
            result.status = response[0];
            result.data = history;
            return res.status(http.OK).send(result);
        } catch (error) {
            logger.error("FUNC: register ", err);
            return res.status(http.INTERNAL_SERVER_ERROR).send(response[3]);
        }
    }

})