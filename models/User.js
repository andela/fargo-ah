module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      lastname: {
        type: DataTypes.STRING
      },
      firstname: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      hashedPassword: {
        type: DataTypes.STRING
      },
      bio: {
        type: DataTypes.STRING
      },
      isverified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      image: {
        type: DataTypes.STRING
      },
      favorites: {
        type: DataTypes.STRING
      }
    },
    {}
  );

  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'userId',
      as: 'articles'
    });
    User.hasMany(models.Follow, {
      as: 'amFollowing',
      foreignKey: 'userId'
    });
    User.hasMany(models.Follow, {
      as: 'followingMe',
      foreignKey: 'userId',
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
    });
    User.hasMany(models.Like, {
      foreignKey: 'userId',
      as: 'likes',
    });
    User.hasMany(models.Reply, {
      foreignKey: 'userId',
      as: 'replies',
    });
  };
  return User;
};
