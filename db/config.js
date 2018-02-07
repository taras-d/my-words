const path = require('path');

module.exports = {
  development: {
    dialect: 'sqlite',
    migrationStorageTableName: '_migrations',
    operatorsAliases: false,
    storage: path.join(__dirname, 'db.sqlite')
  }
};