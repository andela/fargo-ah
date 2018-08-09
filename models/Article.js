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
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedCount: DataTypes.INTEGER,
    tagList: DataTypes.ARRAY(DataTypes.STRING),
    favorited: DataTypes.BOOLEAN,
    favoritesCount: DataTypes.INTEGER,
    imageUrl: DataTypes.STRING
  }, {});

  Article.associate = (models) => {
    // associations can be defined here

    Article.belongsTo(
      models.User,
      {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      }
    );
  };

  return Article;
};
