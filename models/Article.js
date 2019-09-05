module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    updatedCount: DataTypes.INTEGER,
    tagList: DataTypes.ARRAY(DataTypes.STRING),
    categorylist: DataTypes.ARRAY(DataTypes.STRING),
    imageUrl: DataTypes.STRING,
    isPaidFor: {
      type: DataTypes.BOOLEAN
    },
    price: {
      type: DataTypes.DECIMAL,
      defaultValue: 0,
    }
  }, {});

  Article.associate = (models) => {
    // associations can be defined here
    Article.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'author',
      onDelete: 'CASCADE',
    });

    Article.belongsTo(
      models.User,
      {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      }
    );
    Article.hasMany(models.Like, {
      foreignKey: 'articleId',
      as: 'likes',
    });
    Article.hasMany(models.Comment, {
      foreignKey: 'articleId',
      as: 'comments',
    });
    Article.hasMany(models.Payment, {
      foreignKey: 'articleId',
      as: 'payments',
    });
  };
  return Article;
};
