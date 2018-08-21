module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hashedPassword: {
      type: DataTypes.STRING,
    },
    bio: {
      type: DataTypes.STRING,
    },
    isverified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    image: {
      type: DataTypes.STRING,
    },
    following: {
      type: DataTypes.STRING,
    },
    favorites: {
      type: DataTypes.STRING,
    },
  }, {});

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'articles',
    });
  };
  return User;
};
