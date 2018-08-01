module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
    image: {
      type: DataTypes.STRING,
    },
    following: {
      type: DataTypes.STRING,
    },
    isverified: {
      type: DataTypes.BOOLEAN,
    },
    favorites: {
      type: DataTypes.STRING,
    },
  }, {});
  return User;
};
