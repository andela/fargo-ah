import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    [, token] = req.headers.authorization.split(' ');
  }
  if (!token) {
    return res.status(401).send('No token has been provided in the request');
  }
  jwt.verify(token, process.env.JWT_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Could not authenticate the provided token' });
    }
    req.userId = decoded.id;
    next();
    return null;
  });
  return null;
};

export default verifyToken;
