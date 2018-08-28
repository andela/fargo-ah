import Validate from 'validatorjs';

/**
* validate Request id parameter
* @param {Object} req
* @param {Object} res
*
* @param {Function} next
*
* @return {Object} json
*/
const idIsNumber = (req, res, next) => {
  const {
    id,
  } = req.params;

  const data = {
    id,
  };
  const rules = {
    id: ['required', 'integer'],
  };
  const validations = new Validate(data, rules, {
    'integer.id': 'The parameter :attribute must be an integer.',
  });

  if (validations.passes()) {
    return next();
  }

  return res.status(406).json({
    success: 'false',
    errors: validations.errors.all(),
  });
};
export default idIsNumber;
