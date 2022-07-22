const { body, validationResult, query, param } = require('express-validator');
const users = require('../models/users');

module.exports = ({
    register: () => {
        return [
            body('email').trim().not().isEmpty().isEmail()
            .withMessage('Please enter a valid email address.')
            .custom((value, { req }) => {
                return users.findOne({ where: {"email": value} }).then(result => {
                    if (result) {
                        return Promise.reject('Account already exists!');
                    }
                });
            }),
            body('password').trim().not().isEmpty()
            .withMessage('Please enter a valid password.'),
            body('repeatpassword').trim().not().isEmpty()
            .withMessage('Please enter a valid password.')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            }),
            body('username').trim().not().isEmpty()
            .withMessage('Please enter a valid username.'),
            body('passwordwallet').trim().not().isEmpty()
            .withMessage('Please enter a valid password wallet.')
        ]
    },
    login: () => {
        return [
            body('email').trim().not().isEmpty().isEmail()
            .withMessage('Please enter a valid email address.')
            .custom((value, { req }) => {
                return users.findOne({ where: {"email": value} }).then(result => {
                    if (!result) {
                        return Promise.reject('Account does not exists!');
                    }
                });
            }),
            body('password').trim().not().isEmpty()
            .withMessage('Please enter a valid password.')
        ]
    }
})