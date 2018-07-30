import db from '../models/index';

export const articleExists = (req, res, next) => {
  const { slug } = req.params;
  db.Article.find({
    where: { slug }
  })
    .then((foundArticle) => {
      if (!foundArticle) {
        return res.status(404).json({
          errors: {
            body: ['this article does not exist']
          }
        });
      }
      if (req.userId !== foundArticle.userId) {
        return res.status(404).json({
          errors: {
            body: ['Not enough permission to perform this operartion']
          }
        });
      }
      req.count = foundArticle.updatedCount;
      next();
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

export const checkCount = (req, res, next) => {
  const { count } = req;
  if (count > 2) {
    return res.status(403).json({
      errors: {
        body: [
          'this article has exceeded its edit limit'
        ]
      }
    });
  }
  next();
};
