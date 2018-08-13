import verifyToken from './verifyToken';

const toggleFree = (req, res, next) => {
  if (req.articleObject.isPaidFor === true) {
    return verifyToken(req, res, next);
  }
  next();
};

export default toggleFree;
