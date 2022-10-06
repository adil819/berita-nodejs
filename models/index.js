const { Sequelize, DataTypes, Model } = require('sequelize');

// sql server
const sequelize = new Sequelize('NodeDB', 'sa', '080199', {
    dialect: 'mssql',
    dialectOptions: {
      // Observe the need for this nested `options` field for MSSQL
      options: {
        // Your tedious options here
        useUTC: false,
        dateFirst: 1,
      },
    },
  });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.beritas = require('./berita')(sequelize, Sequelize);
module.exports = db;