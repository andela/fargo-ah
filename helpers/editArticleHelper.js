import { Article } from '../models';
import Utilities from './utilities';


const editResponse = (res, articleObject, imageUrl = null, next) => {
  const {
    title, description, body, isPaidFor, price, count, slug, tagList, categorylist,
  } = articleObject;

  Article.update({
    title,
    description,
    body,
    isPaidFor,
    tagList,
    categorylist,
    price,
    imageUrl,
    updatedCount: Utilities.increaseCount(count)
  }, {
    where: {
      slug,
    },
    returning: true,
    plain: true
  })
    .then(result => res.status(200).json({
      success: true,
      article: result[1]
    }))
    .catch(next);
};

export default editResponse;
