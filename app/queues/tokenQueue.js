const fs = require('fs');
const solc = require('solc');
const tokenServices = require('../services/tokenServices');

require('dotenv').config();
const retrycheck = 2;
const decimals = 18;
const async = require('async');
const Web3 = require('web3');
const request = require('request');
var Tx = require('ethereumjs-tx').Transaction


const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETH_NETWORK_PROVIDER));

const kue = require('kue');
const { exit } = require('process');
const chainId = 3;
const queue = kue.createQueue();
console.log('WORKER CONNECTED');

queue.process('deployed', (job, done) => {
    console.log('WORKER JOB COMPLETE');
    const address = job.data.account.address;
    const secret = job.data.account.privateKey.substring(2);
    initialsupply = job.data.initialsupply;
    retry = job.data.retry;
    tokenname = job.data.tokenname;
    tokensymbol = job.data.tokensymbol;
    const inputToken = fs.readFileSync('erc20.sol').toString();
    const outputToken = solc.compile(inputToken,'1');
    const bytecodeToken = outputToken.contracts['VNP'].bytecode;
    const abiToken = JSON.parse(outputToken.contracts['VNP'].interface);

    var contract = new web3.eth.Contract(abiToken);

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
            console.log(err)
            if (retry < retrycheck) {
                retry = retry + 1
                var requestOpt = {
                    url: process.env.URL_TOKEN,
                    method: "post",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: {
                        "initialsupply": initialsupply,
                        "tokenname": tokenname,
                        "tokensymbol": tokensymbol
                    }
                }
                let options = requestOpt;
                
                request(options)
                done(null, 'unknown');
            } else {
                console.log('Success contract fail')
                done(null, 'unknown');
            }
        } else {
            tokenServices.create({"address_token": ret.deployed.contractAddress, "tx_id": ret.deployed.transactionHash, 
            "block_hash": ret.deployed.blockHash, "block_number": ret.deployed.blockNumber, "balance": initialsupply, "gas_used": ret.deployed.gasUsed, "address_user": ret.deployed.from, "token_name": tokensymbol})
            done(null, 'Success');
        }
    })
});
