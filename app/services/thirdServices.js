const tokenEntities = require('../entities/tokenEntities');
const ERC20ABI = require('../../configs/abi/erc20.json')
const historyEntities = require('../entities/historyEntities');
const ethGateWay = require('../blockchain/eth/ethGateWay');
const _ = require('lodash');
const Const = require('../common/Const')
const logger = require('../../logs/winston');
const util = require('util');
const callContract = util.promisify(ethGateWay.callContract)
const request = require('request');
const { result } = require('lodash');
const requestPromise = util.promisify(request);

module.exports = ({
    classname: "thirdServices",

    getProduct: async (data) => {
        try {
            if(data.data.length == 0) {
                return {
                    "statusCode": 200,
                    "data": data.data
                };
            }
            let options = {
                'method': 'GET',
                'url': `${process.env.URL_THIRD}/v1/product/getList`,
                'headers': {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            const response = await requestPromise(options);
            var result;
            var arr = [];
            if (response.statusCode != 200) {
                logger.error("Internal Server Error! ")
                throw error
            } else {
                if (response.body) {
                    result = JSON.parse(response.body);
                    result.products.map(el => {
                        data.data.map(il => {
                            if (el.productId == il.product_id) {
                                el.addressToken = il.address_token;
                                el.blockHash = il.block_hash;
                                el.blockNumber = il.block_number;
                                el.addressUser = il.address_user;
                                el.txId = il.tx_id;
                                arr.push(el)
                            }
                        })
                    })
                } else {
                    throw new Error("Internal Server Error! ")
                }
            }
            return {
                "statusCode": 200,
                "data": arr
            };
        } catch (error) {
            logger.error("Get product " + error)
            throw error
        }
    },

    getOneProduct: async (data) => {
        try {
            let options = {
                'method': 'GET',
                'url': `${process.env.URL_THIRD}/v1/product/getDetail/${data.data.product_id}`,
                'headers': {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            const response = await requestPromise(options);
            var result;
            if (response.statusCode != 200) {
                logger.error("Internal Server Error! ")
                throw error
            } else {
                if (response.body) {
                    result = JSON.parse(response.body);
                    result.product.addressToken = data.data.address_token;
                    result.product.blockHash = data.data.block_hash;
                    result.product.blockNumber = data.data.block_number;
                    result.product.addressUser = data.data.address_user;
                    result.product.txId = data.data.tx_id;
                } else {
                    throw new Error("Internal Server Error! ")
                }
            }
            return {
                "statusCode": 200,
                "data": result.product
            };
        } catch (error) {
            logger.error("Get product " + error)
            throw error
        }
    },

    getDiaryById: async (data) => {
        try {
            let options = {
                'method': 'GET',
                'url': `${process.env.URL_THIRD_SECOND}/v1/diary/getListByProduct/${data.productId}/${data.relateDiary}/${data.key}`,
                'headers': {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            const response = await requestPromise(options);
            var result;
            if (response.statusCode != 200) {
                logger.error("Internal Server Error! ")
                throw error
            } else {
                console.log(response)
                if (response.body) {
                    result = JSON.parse(response.body);
                    result.product.addressToken = data.data.address_token;
                    result.product.blockHash = data.data.block_hash;
                    result.product.blockNumber = data.data.block_number;
                    result.product.addressUser = data.data.address_user;
                    result.product.txId = data.data.tx_id;
                } else {
                    throw new Error("Internal Server Error! ")
                }
            }
            return {
                "statusCode": 200,
                "data": result.product
            };
        } catch (error) {
            logger.error("Get product " + error)
            throw error
        }
    }
})