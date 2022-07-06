var express = require('express');
var router = express.Router();
const { check, body, param } = require('express-validator');
const isAuth = require('../../until/validateToken');
const authController = require('../../app/controllers/authController');
const tokenController = require('../../app/controllers/tokenController');
const historyController = require('../../app/controllers/historyController');
router.post('/login', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 0 })
        .isAlphanumeric()
        .trim()
], authController.login);

router.post('/register', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({ min: 5, max: 100 })
        .isAlphanumeric()
        .trim(),
    body('repeatPassword')
        .isLength({ min: 5, max: 100 })
        .isAlphanumeric()
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    body('userName')
        .isLength({ min: 6, max: 100 })
        .isAlphanumeric()
        .trim(),
    body('passwordWallet', 'Password has to be valid.')
        .isLength({ min: 5, max: 100 })
        .isAlphanumeric()
        .trim(),
], authController.register);

router.post('/token', [
    body('initialsupply', 'initial supply has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(),
    body('tokenname', 'token name has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(), 
    body('tokensymbol', 'token symbol has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(),
], isAuth.validateToken, tokenController.create);


router.get('/token/balance', [
    param('addresstoken', 'address token has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(),
    param('addressuser', 'address token has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim()
], tokenController.getBalance);

router.post('/token/transfer', [
    body('to', 'address to has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(),
    body('amount', 'amount has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(),
    body('addresstoken', 'address token has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(),
    body('passwordwallet', 'password wallet has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(),
], isAuth.validateToken, tokenController.transfer);

router.get('/token/history', [

], historyController.getHistory);

module.exports = router;
