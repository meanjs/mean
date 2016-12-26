'use strict';

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        User.hasMany(models.Task);
      }
    }
  });

  return User;
};
