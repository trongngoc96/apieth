const express = require('express');
const router = express.Router();

const authController = require('../../app/controllers/authController');
const tokenController = require('../../app/controllers/tokenController');
const historyController = require('../../app/controllers/historyController');
const validateAuth =  require('../../app/requests/ValidateAuth');
const validateToken =  require('../../app/requests/ValidateToken');
const validateHistory =  require('../../app/requests/ValidateHistory');

const isAuth = require('../../until/validateToken');

//api auth
router.post('/login', validateAuth.login(), authController.login);
router.post('/register', validateAuth.register(), authController.register);

//api token
router.post('/token', isAuth.validateToken, validateToken.createToken(), tokenController.create);
router.get('/token', tokenController.getToken);
router.get('/token/balance', validateToken.tokenBalance(), tokenController.getBalance);
router.post('/token/transfer', isAuth.validateToken, validateToken.tokenTransfer(), tokenController.transfer);
router.post('/token/mint', isAuth.validateToken, validateToken.tokenMint(), tokenController.tokenMint);
router.post('/token/burn', isAuth.validateToken, validateToken.tokenBurn(), tokenController.tokenBurn);

//api token history
router.get('/token/history', historyController.getHistory);

module.exports = router;