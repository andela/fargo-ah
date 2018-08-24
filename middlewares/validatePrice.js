const validatePrice = (req, res, next) => {
  const minPrice = 0.28;
  const maxPrice = 5.53;
  if (req.body.article.price && typeof req.body.article.price !== 'number') {
    return res.status(400).json({
      errors: {
        body: [
          'Article price must be in figure'
        ]
      }
    });
  }
  if (req.body.article.isPaidFor && !req.body.article.price) {
    return res.status(400).json({
      errors: {
        body: [
          'Article is to be paid for, but price is not set'
        ]
      }
    });
  }
  if (req.body.article.price < minPrice
        || req.body.article.price > maxPrice) {
    return res.status(400).json({
      errors: {
        body: [
          'Price can only be between $0.28 to $5.53'
        ]
      }
    });
  }
  next();
};
export default validatePrice;
