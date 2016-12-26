'use strict';

module.exports = function(sequelize, DataTypes) {
  const Comment = sequelize.define('Comment', {
    body: {
      type: DataTypes.TEXT,
      comment: 'The comment text',
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'The user who created the comment'
    }
  }, {
    classMethods: {
      associate: function(models) {
        Comment.belongsTo(models.Task, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });

  return Comment;
};
