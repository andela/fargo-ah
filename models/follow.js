module.exports = (sequelize, DataTypes) => {
  const Follow = sequelize.define('Follow', {
    followId: {
      type: DataTypes.INTEGER,
      onDelete: 'CASCADE',
      references: {
        model: 'Users',
        key: 'id',
      }
    },
  }, {});

  Follow.associate = (models) => {
    Follow.belongsTo(models.User, {
      as: 'myFollowers',
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  return Follow;
};
