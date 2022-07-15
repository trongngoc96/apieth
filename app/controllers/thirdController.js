const Const = require("../common/Const");
const ethGateWay = require('../blockchain/eth/ethGateWay');
const authServices = require('../services/authServices');
const ethServices = require('../services/ethServices');
const logger = require('../../logs/winston');
const BigNumber = require('bignumber.js');
const { validationResult } = require('express-validator');
const request = require('request');
const util = require('util');
const requestPromise = util.promisify(request);
module.exports = ({
    classname: 'tokenController',

    getBalanceInternalExchange: async (userId, currency, next) => {
        try {
            let options = {
                'method': 'GET',
                'url': `${process.env.URL_EXTERNAL}/api/external/user/balance?external_id=${userId}&coin=${currency}`,
                'headers': {
                    'Authorization': 'Bearer eyJpdiI6IjBZQTJQMloxanhFRmhJV2RZc0RUQlE9PSIsInZhbHVlIjoibHZFajB1bVwvTGFGVldRK1YycXFCZlB5QUQ1ZFdHcDV1WWg1ZTk2b21TSWxNK2U3bUxIcHBrVjd5bVErZ05NSFgiLCJtYWMiOiJiMmRmMmU1ODBlOTQ0ZjYzNWY5YTY1MDkxODFhZmM5NTNlZGRhMmY1ZjkyNzI2Yjg0NTMyZDYzMWI3NWVlNjQwIn0=',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            const response = await requestPromise(options);
            var balance;
            if (response.statusCode != 200) {
                logger.error("Internal Server Error! ")
                balance = 0;
            } else {
                if (response.body) {
                    const result = JSON.parse(response.body);
                    if (result.data.data.length == 0) {
                        balance = 0;
                    } else {
                        balance = result.data.data[0].available_balance;
                    }
                } else {
                    throw new Error("Internal Server Error! ")
                }
            }
            return balance;
        } catch (error) {
            logger.error("Get Balance Internal Exchange: " + error)
            throw error
        }
    },
})