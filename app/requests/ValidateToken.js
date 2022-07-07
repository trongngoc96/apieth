const { body, validationResult, query, param } = require('express-validator');
module.exports = ({
    createToken: () => {
        return [
            body('initialsupply').trim().not().isEmpty()
            .withMessage('Please enter a valid initialsupply.'),
            body('tokenname').trim().not().isEmpty()
            .withMessage('Please enter a valid tokenname.'),
            body('tokensymbol').trim().not().isEmpty()
            .withMessage('Please enter a valid tokensymbol.'),
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
    }

})
