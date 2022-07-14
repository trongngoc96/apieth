const historyServices = require('../services/historyServices');
const http = require('http-status-codes');
const response = require('../common/respone.json');
const logger = require('../../logs/winston');

const { check, body, validationResult } = require('express-validator')

module.exports = ({
    classname: 'historyController',

    getHistory: async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed, entered data is incorrect.');
                error.statusCode = 442;
                error.data = errors.array();
                throw error;
            }
            const addressToken = req.query.addresstoken;
            const from = req.query.from;
            const to = req.query.to;
            const status = req.query.status
            const data = {
                "address_token": addressToken,
                "from": from,
                "to": to,
                "status": status
            }
            const history = await historyServices.findAll(data)
            return res.status(200).send(history)
        } catch (error) {
            logger.error("FUNC: get history ", error);
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        }
    }

})