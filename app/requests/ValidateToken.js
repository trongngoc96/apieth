const { body, validationResult, query, param } = require('express-validator');
const token = require('../models/tokens');
module.exports = ({
    createToken: () => {
        return [
            body('initialsupply').trim().not().isEmpty()
            .withMessage('Please enter a valid initialsupply.'),
            body('tokenname').trim().not().isEmpty()
            .withMessage('Please enter a valid tokenname.'),
            body('tokensymbol').trim().not().isEmpty()
            .withMessage('Please enter a valid tokensymbol.'),
            body('productid').trim().not().isEmpty()
            .withMessage('Please enter a valid tokensymbol.')
            .custom((value, { req }) => {
                return token.findOne({ where: {"product_id": value} }).then(result => {
                    if (result) {
                        return Promise.reject('product id already exists!');
                    }
                });
            }),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet'),
        ]
    },
    tokenBalance: () => {
        return [
            query('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            query('addressuser').trim().not().isEmpty()
            .withMessage('Please enter a valid addressuser.')
        ]
    },
    tokenPrice: () => {
        return [
            body('amount').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.'),
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet')
        ]
    },
    getPrice: () => {
        return [
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet')
        ]
    },
    tokenMint: () => {
        return [
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet'),
            body('amount').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.')
        ]
    },
    tokenConfirm: () => {
        return [
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet'),
            body('to').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.')
        ]
    },
    tokenReject: () => {
        return [
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet'),
            body('to').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.')
        ]
    },
    tokenWithdraw: () => {
        return [
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet'),
            body('to').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.'),
            body('amount').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.')
        ]
    },
    tokenBurn: () => {
        return [
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet'),
            body('amount').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.')
        ]
    },
    tokenTransfer: () => {
        return [
            body('to').trim().not().isEmpty()
            .withMessage('Please enter a valid to.'),
            body('amount').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.'),
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet.')
        ]
    },

    tokenBuy: () => {
        return [
            body('amount').trim().not().isEmpty()
            .withMessage('Please enter a valid amount.'),
            body('addresstoken').trim().not().isEmpty()
            .withMessage('Please enter a valid addresstoken.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet.')
        ]
    }

})
