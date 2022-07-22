const Sequelize = require('sequelize');

const sequelize = require('../../configs/connect/database');

const Users = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false
  } ,
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false
  },
  keystore: {
    type: Sequelize.STRING(5000),
    allowNull: false
  },
  keystore_admin: {
    type: Sequelize.STRING(5000),
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  },
  passwordWallet: {
    type: Sequelize.STRING
  },
  balance: {
    type: Sequelize.FLOAT
  }

});

module.exports = Users;
