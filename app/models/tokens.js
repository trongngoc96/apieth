const Sequelize = require('sequelize');

const sequelize = require('../../configs/connect/database');

const Users = sequelize.define('tokens', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  address_token: {
    type: Sequelize.STRING,
    allowNull: false
  } ,
  block_hash: {
    type: Sequelize.STRING,
    allowNull: false
  },
  block_number: {
    type: Sequelize.INTEGER
  },
  gas_used: {
    type: Sequelize.INTEGER
  },
  address_user: {
    type: Sequelize.STRING,
    allowNull: false
  },
  tx_id: {
    type: Sequelize.STRING
  },
  token_name: {
    type: Sequelize.STRING
  },
  created_date: {
    type: Sequelize.INTEGER
  },
  balance: {
    type: Sequelize.FLOAT
  }

});

module.exports = Users;
