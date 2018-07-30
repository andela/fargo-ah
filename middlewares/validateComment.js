const validateComment = (req, res, next) => {
  const { body } = req.body.comment;
  const errors = [];
  if (!body) {
    errors.push('Comment can not be empty');
  }
  if (typeof body !== 'string') {
    errors.push('Comment must be a string');
  }
  if (errors.length !== 0) {
    return res.status(403).json({
      success: false,
      errors: {
        body: [...errors]
      }
    });
  }
  next();
};

export default validateComment;
