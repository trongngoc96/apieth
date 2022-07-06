var express = require('express');
var router = express.Router();
const { check, body, param } = require('express-validator');
const isAuth = require('../../until/validateToken');
const authController = require('../../app/controllers/authController');
const tokenController = require('../../app/controllers/tokenController');
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
    body('addresstoken', 'address token has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim(),
    body('addressuser', 'address token has to be valid.')
        .isLength({ min: 1 })
        .isAlphanumeric()
        .trim()
], tokenController.getBalance);

module.exports = router;
