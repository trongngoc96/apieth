const Sequelize = require('sequelize');

const sequelize = require('../../configs/connect/database');

const Latests = sequelize.define('latests', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  block_number: {
    type: Sequelize.STRING,
    allowNull: false
  }

});

module.exports = Latests;
