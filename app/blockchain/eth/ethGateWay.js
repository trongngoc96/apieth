const httpProviders = {
    development: process.env.ETH_NETWORK_PROVIDER,
};

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(httpProviders[process.env.NODE_ENV]));

module.exports = ({
    classname: "ethGateWay",

    getLib: () => {
        return web3;
    }
})