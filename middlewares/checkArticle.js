import { Article } from '../models';
/**
   * validate Request id parameter
   * @param {Object} req
   * @param {Object} res
   *
   * @param {Function} next
   *
   * @return {Object} json
   */
const checkArticle = (req, res, next) => {
  const { id } = req.params;
  Article.find({
    where: {
      id
    }
  })
    .then((article) => {
      if (article) return next();
      return res.status(404).json({
        errors: {
          body: [
            'Ooops! the article cannot be found.'
          ]
        }
      });
    });
};
export default checkArticle;
