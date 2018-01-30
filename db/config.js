const common = {
  dialect: 'sqlite',
  migrationStorageTableName: '_migrations',
  operatorsAliases: false
};

const development = Object.assign({}, common, {
  storage: 'db/dev.sqlite'
});

const production = Object.assign({}, common, {
  storage: 'db/db.sqlite'
});

module.exports = { development, production };