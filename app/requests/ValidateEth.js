const { body, validationResult, query, param } = require('express-validator');
module.exports = ({
    send: () => {
        return [
            body('to').trim().not().isEmpty()
            .withMessage('Please enter a valid tokenname.'),
            body('amount').trim().not().isEmpty()
            .withMessage('Please enter a valid tokensymbol.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid passwordwallet'),
        ]
    }

})
