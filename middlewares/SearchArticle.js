import Sequelize from 'sequelize';
import winston from 'winston';
import models from '../models';

const { Article, User } = models;

const { Op } = Sequelize;
const searchArticle = async (req, res, next) => {
  try {
  // query the database
    const articles = await Article.findAll({
      where: {
        [Op.or]: [{
          tagList: { [Op.contains]: [req.query.tag] }
        }, { title: req.query.title },
        { userId: req.query.uid }]
      },
      include: [{
        model: User,
        attributes: ['username'],
      }]
    });
    if (articles.length > 0) {
      next();
      return res.status(200).send({ articles, message: 'These are the articles found' });
    }
    // next();
    return res.status(404).json({ message: 'No article found for your search' });
  } catch (err) {
  // next();
    winston.info(err);
    return res.status(400).json({ message: 'Something went wrong' });
  }
};

export default searchArticle;
