import jwt from 'jsonwebtoken';

const toggleFree = (req, res, next) => {
  if (req.articleObject.isPaidFor === true) {
    let fullToken;
    if (req.body.authorization) {
      fullToken = req.body.authorization;
    } else {
      fullToken = req.headers.authorization;
    }
    if (fullToken) {
      const token = fullToken.split(' ')[1];
      jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({
            success: false,
            errors: {
              body: ['Could not authenticate the provided token'],
            }
          });
        }
        req.userId = decoded.id;
        next();
      });
    }
  }
  next();
};

export default toggleFree;
