import db from '../models';

const { Comment } = db;
const getComment = (req, res, next) => {
  Comment.findById(req.params.id)
    .then((comment) => {
      if (!comment) {
        return res.status(404).json({
          success: false,
          errors: {
            body: ['The comment does not exist']
          },
        });
      }
      req.commentObject = comment;
      next();
    })
    .catch(next);
};

export default getComment;
