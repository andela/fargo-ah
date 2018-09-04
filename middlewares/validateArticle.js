/**
 * @description this function checks that fields are not empty
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} a status code and json object if theres error
 *  or continue to the next middleware using next()
 */
const validateArticle = (req, res, next) => {
  const { file } = req.files;
  const article = JSON.parse(req.body.data);
  req.body.article = article.article;

  if (!req.body.article) {
    return res.status(400).json({
      errors: {
        body: [
          'Please check that article field is present'
        ]
      }
    });
  }
  const { title, description, body } = req.body.article;

  if (!title || !description || !body) {
    return res.status(400).json({
      errors: {
        body: [
          'Please check that your title, description or body field is not empty'
        ]
      }
    });
  }
  req.body.article.title = title.trim();
  req.body.article.description = description.trim();
  req.body.article.body = body.trim();
  req.body.article.imageData = file.path;

  next();
};

export default validateArticle;
