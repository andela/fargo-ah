import db from '../models';

const { Article } = db;
const getArticle = (req, res, next) => {
  Article.findOne({ where: { slug: req.params.slug } })
    .then((article) => {
      if (!article) {
        return res.status(404).json({
          success: false,
          errors: {
            body: ['The article does not exist']
          },
        });
      }
      req.articleObject = article;
      next();
    })
    .catch(next);
};

export default getArticle;
