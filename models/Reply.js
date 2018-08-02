module.exports = (sequelize, DataTypes) => {
  const Reply = sequelize.define('Reply', {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {});
  Reply.associate = (models) => {
    Reply.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    Reply.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      onDelete: 'CASCADE',
    });
  };
  return Reply;
};
