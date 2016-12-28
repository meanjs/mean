'use strict';

module.exports = function(sequelize, DataTypes) {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      comment: 'A title describing the task',
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The user who created and owns this task'
    },
  }, {
    classMethods: {
      associate: function (models) {
        Task.hasMany(models.Comment);
      }
    }
  });

  return Task;
};
