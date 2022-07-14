const Sequelize = require('sequelize');

const sequelize = require('../../configs/connect/database');

const Users = sequelize.define('historys', {
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
    type: Sequelize.STRING
  },
  block_number: {
    type: Sequelize.INTEGER
  },
  fee: {
    type: Sequelize.INTEGER
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false
  },
  to: {
    type: Sequelize.STRING,
    allowNull: false
  },
  amount: {
    type: Sequelize.INTEGER
  },
  tx_id: {
    type: Sequelize.STRING
  },
  tx_raw: {
    type: Sequelize.STRING(1000)
  },
  status: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  created_date: {
    type: Sequelize.INTEGER
  }

});

module.exports = Users;
