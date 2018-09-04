import Sequelize from 'sequelize';
import { trim, escape } from 'validator';
import { User } from '../models';
import sendVerificationEmail from './sendmail';

const { Op } = Sequelize;

export const resendVerificationEmail = async (req, res) => {
  const { email } = req.body.user;
  try {
    const usertoBeVerified = await User.findOne({
      where: { email }
    });

    if (usertoBeVerified === null || usertoBeVerified === 'null') {
      return res.status(400).json({
        errors: {
          body: ['You have entered an unregistered email address']
        }
      });
    }
    if (usertoBeVerified && usertoBeVerified.isverified === true) {
      return res.status(400).json({
        errors: {
          body: ['Your account has already been verified']
        }
      });
    }

    sendVerificationEmail.sendEmail(usertoBeVerified);
    res.status(200).json({
      message: {
        body: ['A verification email has been sent to you']
      }
    });
  } catch (err) {

  // probable error: Cannot read property "isunverified" for an email address that doesn't exist

  }
};

/**
  * @function searchByTagAuthorOrTitle
  * @summary Articles can be searched by Tag, Author or TItle
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} returns the list of articles matching the search criteria
  */
export const searchByTagAuthorOrTitle = (req, res) => {
  const searchParameters = {};
  // Get every parameter and key passed in the query string
  const queryObjectKeysAndValues = Object.entries(req.query);
  let { pageNumber = 1, pageSize = 10 } = req.query;
  pageNumber = parseInt(pageNumber, 10);
  pageSize = parseInt(pageSize, 10);
  if ((pageNumber < 1 || !Number.isInteger(pageNumber)) || pageSize < 10) {
    return res.status(400).json({
      errors: {
        body: [
          'Please ensure your query is an integer and pageSize is greater than 9'
        ]
      }
    });
  }
  const limit = pageSize;
  const offset = (pageNumber - 1) * limit;
  const queryStringValues = Object.values(req.query);
  let textToSearch = queryStringValues[0];
  textToSearch = textToSearch.toLowerCase();
  textToSearch = trim(escape(textToSearch));

  // selects the search value from the key
  const searchCriteria = queryObjectKeysAndValues[0][0];
  if (searchCriteria === 'tag') {
    searchParameters.where = {
      [Op.or]: [{ tagList: { [Op.contains]: [textToSearch] } }]
    };
  }
  if (searchCriteria === 'category') {
    searchParameters.where = {
      [Op.or]: [{ categorylist: { [Op.contains]: [textToSearch] } }]
    };
  }
  if (searchCriteria === 'title') {
    searchParameters.where = {
      title: { [Op.iLike]: `%${textToSearch}%` }
    };
  }
  /**
  * set the relationship to search from the right table
  * since the attribute to be searched for is on the right table
  * */
  if (searchCriteria === 'author') {
    searchParameters.where = {
      [Op.or]:
        [{ firstname: Sequelize.where(Sequelize.col('User.firstname'), { [Op.iLike]: `%${textToSearch}%` }) },
          { lastname: Sequelize.where(Sequelize.col('User.lastname'), { [Op.iLike]: `%${textToSearch}%` }) }
        ]

    };
  }
  searchParameters.limit = limit;
  searchParameters.offset = offset;
  searchParameters.include = [{
    model: User,
    as: 'author',
    attributes: ['username', 'firstname', 'lastname'],
  }];
  return searchParameters;
};

export const listOfCategories = (req, res) => {
  const categorieslist = ['Politics', 'Science', 'Sports', 'Culture', 'Education',
    'Movies', 'Agriculture', 'Cartoon', 'Technology', 'Business', 'Entertainment'];
  return res.status(200).json({ message: 'List of categories', categorieslist });
};
