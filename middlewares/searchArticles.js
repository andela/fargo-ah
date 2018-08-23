import models from '../models';
import { searchByTagAuthorOrTitle } from '../helpers/exports';

const { Article } = models;
/**
  * @function searchForArticle
  * @summary Return a user's profile after updating it
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @param {objecg} next - passes error to the error handler
  * @returns {object} An object containing all the data related to the user if update successful
  */
const searchForArticles = async (req, res, next) => {
  try {
    // query the database
    const searchParameters = searchByTagAuthorOrTitle(req, res);
    const articles = await Article.findAll(searchParameters);
    if (articles.length > 0) {
      return res.status(200).send({ articles, message: 'These are the articles found' });
    }
    return res.status(200).json({ message: 'No article found for your search' });
  } catch (err) {
    next(err);
  }
};
export default searchForArticles;
