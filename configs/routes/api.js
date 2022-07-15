const express = require('express');
const router = express.Router();

const authController = require('../../app/controllers/authController');
const tokenController = require('../../app/controllers/tokenController');
const ethController = require('../../app/controllers/ethController');
const historyController = require('../../app/controllers/historyController');
const validateAuth =  require('../../app/requests/ValidateAuth');
const validateToken =  require('../../app/requests/ValidateToken');
const validateHistory =  require('../../app/requests/ValidateHistory');
const validateEth =  require('../../app/requests/ValidateEth');

const isAuth = require('../../until/validateToken');

//api auth
router.post('/login', validateAuth.login(), authController.login);
router.post('/register', validateAuth.register(), authController.register);

//api token
router.post('/token', isAuth.validateToken, validateToken.createToken(), tokenController.create);
router.get('/token', tokenController.getToken);
router.get('/token/third/:id', tokenController.getTokenById);
// router.get('/token/:id/:relatediary/:key', tokenController.getDiaryById);
router.get('/token/balance', validateToken.tokenBalance(), tokenController.getBalance);
router.post('/token/transfer', isAuth.validateToken, validateToken.tokenTransfer(), tokenController.transfer);
router.post('/token/mint', isAuth.validateToken, validateToken.tokenMint(), tokenController.tokenMint);
router.post('/token/burn', isAuth.validateToken, validateToken.tokenBurn(), tokenController.tokenBurn);

//api eth
router.post('/eth/send', isAuth.validateToken, validateEth.send(), ethController.sendEth);

//api token history
router.get('/token/history', historyController.getHistory);

//api eth history
// router.get('/eth/history', historyController.getHistory);

//api third party
//router.get('/token/history', historyController.getHistory);

module.exports = router;