import Sequelize from 'sequelize';
import { trim, escape } from 'validator';
import { User } from '../models';
import sendVerificationEmail from './sendmail';

const { Op } = Sequelize;

exports.resendVerificationEmail = async (req, res) => {
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
exports.searchByTagAuthorOrTitle = (req, res) => {
  const searchParameters = {};
  // Get every parameter and key passed in the query string
  const keysAndValues = Object.entries(req.query);
  // Assign page number as the first page if the page number is not passed
  let pageNumber = typeof req.query.pageNumber === 'undefined' ? 1 : req.query.pageNumber;
  let pageSize = typeof req.query.pageSize === 'undefined' ? 10 : req.query.pageSize;
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
  textToSearch = trim(escape(textToSearch));

  // selects the search value from the key
  const searchCriteria = keysAndValues[0][0];
  if (searchCriteria === 'tag') {
    searchParameters.where = {
      [Op.or]: [{ tagList: { [Op.contains]: [textToSearch] } }]
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
    searchParameters.where = { username: Sequelize.where(Sequelize.col('User.username'), { [Op.eq]: `${textToSearch}` }) };
  }
  searchParameters.limit = limit;
  searchParameters.offset = offset;
  searchParameters.include = [{
    model: User,
    attributes: ['username'],
  }];
  return searchParameters;
};
