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
    favorites: {
      type: DataTypes.STRING,
    },
  }, {});
  User.Instance.prototype.toAuthJSON = () => ({
    username: this.username,
    email: this.email,
  });
  return User;
};
