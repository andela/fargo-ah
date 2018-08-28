
module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {}, {});

  Like.associate = (models) => {
    Like.belongsTo(models.Article, {
      foreignKey: 'articleId',
      as: 'likedArticle',
    });
    Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };
  return Like;
};
