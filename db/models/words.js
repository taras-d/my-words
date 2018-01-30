'use strict';
module.exports = (sequelize, DataTypes) => {
  const Words = sequelize.define('words', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false
    },
    translation: {
      type: DataTypes.STRING,
      allowNull: true
    },
    repeat: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    freezeTableName: true
  });

  Words.associate = function(models) {
    // associations can be defined here
  }

  return Words;
};