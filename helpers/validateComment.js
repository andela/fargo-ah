const validateComment = (req) => {
  const { body, commentId } = req.body.comment;
  const errors = [];
  if (!body) {
    errors.push('Comment can not be empty');
  }
  if (typeof body !== 'string') {
    errors.push('Comment must be a string');
  }
  if (commentId) {
    if (typeof commentId !== 'number') {
      errors.push('parentId must be a number');
    }
  }
  return errors;
};

export default validateComment;
