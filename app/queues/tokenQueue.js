const fs = require('fs');
const solc = require('solc');
const tokenServices = require('../services/tokenServices');
const logger = require('../../logs/winston');
const ABIERC20 = require('../../configs/abi/erc20.json')

require('dotenv').config();
const decimals = 18;
const async = require('async');
const Web3 = require('web3');
var Tx = require('ethereumjs-tx').Transaction


const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NETWORK_PROVIDER));

const kue = require('kue');
const { exit } = require('process');
const chainId = 3;
const queue = kue.createQueue();
console.log('WORKER CONNECTED');
const source = fs.readFileSync('erc20.sol').toString();
const input = {
    language: 'Solidity',
    sources: {
      'erc20.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };
queue.process('deployed', (job, done) => {
    console.log('WORKER JOB COMPLETE');
    const address = job.data.account.address;
    const secret = job.data.account.privateKey.substring(2);
    initialsupply = job.data.initialsupply;
    retry = job.data.retry;
    tokenname = job.data.tokenname;
    tokensymbol = job.data.tokensymbol;
    const outputToken = JSON.parse(solc.compile(JSON.stringify(input)));
    const bytecodeToken = outputToken.contracts['erc20.sol']['ERC20'].evm.bytecode.object;
    // const abiToken = JSON.parse(outputToken.contracts['erc20.sol']['ERC20'].interface);

    var contract = new web3.eth.Contract(ABIERC20);

    const hexdata = contract.deploy({
        data: '0x' + bytecodeToken,
        arguments: [initialsupply, tokenname, decimals, tokensymbol] 
    }).encodeABI()

    async.auto({
        deployed: (next) => {
            var privateKey = new Buffer(secret, 'hex');
            web3.eth.getTransactionCount(address)
                .then(function (count) {
                    var rawTx = {
                        nonce: web3.utils.toHex(count),
                        gasPrice: web3.utils.toHex(10000000),
                        gasLimit: web3.utils.toHex(3600000),
                        // to: mainAddress,
                        value: web3.utils.toHex(0),
                        data: hexdata,
                        chainId: chainId
                    }
                    try {
                        var tx = new Tx(rawTx, { chain: 'ropsten' });
                        tx.sign(privateKey);
                    } catch (e) {
                        console.log(e)
                        return next(e)
                    }
                    var serializedTx = tx.serialize();
                    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
                        .on('receipt', function (contract_address) {
                            return next(null, contract_address);
                        })
                        .on('error', function (error) {
                            console.log(error)
                            return next(error);
                        });
                });
        },

    }, (err, ret) => {
        if (err) {
            logger.error('ERR create token queue!!', err)
            return done(err.message);
        } else {
            tokenServices.create({"address_token": ret.deployed.contractAddress, "tx_id": ret.deployed.transactionHash, "product_id": job.data.productid,
            "block_hash": ret.deployed.blockHash, "block_number": ret.deployed.blockNumber, "balance": initialsupply, "status": true, "gas_used": ret.deployed.gasUsed, "address_user": ret.deployed.from, "token_name": tokensymbol})
            return done(null, 'Success');
        }
    })
});
