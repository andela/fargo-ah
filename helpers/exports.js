import winston from 'winston';
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
    if (usertoBeVerified === null || usertoBeVerified === 'null' || usertoBeVerified.isverified === true) {
      return res.status(400).json({
        errors: {
          body: ['A verification email will be sent to you if your account is not yet verified']
        }
      });
    }
    sendVerificationEmail.sendEmail(usertoBeVerified);
    res.status(200).json({
      message: {
        body: ['A verification email will be sent to you if your account is not yet verified']
      }
    });
  } catch (err) {
  /*   probable error: Cannot read property "isunverified" for an email address that doesn't exist
    This should be passed to the login */
    winston.info(err);
  }
};

/**
  * @function newsearch
  * @summary Return a user's profile after updating it
  * @param {object} req - Request object
  * @param {object} res - Response object
  * @returns {object} An object containing all the data related to the user if update successful
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
    searchParameters.limit = limit;
    searchParameters.offset = offset;
  }
  if (searchCriteria === 'title') {
    searchParameters.where = {
      title: { [Op.iLike]: `%${textToSearch}%` }
    };
    searchParameters.limit = limit;
    searchParameters.offset = offset;
  }

  let includeModel = [{
    model: User,
    attributes: ['username'],
  }];
  /**
  * set the relationship to search from the right table
  * since the attribute to be searched for is on the right table
   * */
  if (searchCriteria === 'author') {
    includeModel = [{
      model: User,
      attributes: ['username'],
    }];
    searchParameters.where = { username: Sequelize.where(Sequelize.col('User.username'), { [Op.iLike]: `%${textToSearch}%` }) };
    searchParameters.limit = limit;
    searchParameters.offset = offset;
  }
  searchParameters.include = includeModel;
  return searchParameters;
};
