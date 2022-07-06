const Sequelize = require('sequelize');
const config = require('./config.json')

const env = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(config[env].database, config[env].username, config[env].password, {
  dialect: config[env].dialect,
  host: config[env].host
});

module.exports = sequelize;
