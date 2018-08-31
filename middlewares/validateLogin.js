import ValidateUser from '../helpers/validate';

// Vallidate all user input
const validateLogin = (req, res, next) => {
  const { email, password } = req.body.user;
  const body = [];
  const checkEmail = ValidateUser.validateEmail(email);
  const checkPassword = ValidateUser.validatePassword(password);
  if (checkEmail.error) {
    body.push({
      emailError: checkEmail.error
    });
  }
  if (checkPassword.error) {
    body.push({
      passwordError: checkPassword.error
    });
  }
  if (body.length > 0) {
    return res.status(400).send({
      errors: { body }
    });
  }

  next();
};

export default validateLogin;
