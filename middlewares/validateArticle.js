/**
 * @description this function checks that fields are not empty
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns {object} a status code and json object if theres error
 *  or continue to the next middleware using next()
 */
const validateArticle = (req, res, next) => {
<<<<<<< HEAD
  if (!req.body.article) {
    return res.status(400).json({
      errors: {
        body: [
          'Please check that article field is present'
=======
  let { title, description, body } = req.body.article;
  try {
    title = title.trim();
    description = description.trim();
    body = body.trim();
  } catch (error) {
    return res.status(400).json({
      errors: {
        body: [
          'Please check that your title, description or body field is not empty'
>>>>>>> ft(create-article): create user article
        ]
      }
    });
  }
<<<<<<< HEAD
  const { title, description, body } = req.body.article;

=======
>>>>>>> ft(create-article): create user article
  if (!title || !description || !body) {
    return res.status(400).json({
      errors: {
        body: [
          'Please check that your title, description or body field is not empty'
        ]
      }
    });
  }
<<<<<<< HEAD
  req.body.article.title = title.trim();
  req.body.article.description = description.trim();
  req.body.article.body = body.trim();
=======
>>>>>>> ft(create-article): create user article

  next();
};

export default validateArticle;
