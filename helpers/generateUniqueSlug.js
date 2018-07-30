import slugify from 'slugify';
import cuid from 'cuid';

/** create a string as slug to make articles unique
 * @param {string} title - title of the article from request body
 * @returns {string} slug - timestamped  string with randomly generated slug to avoid collision
 */
const generateUniqueSlug = (title) => {
  const sluggedTitle = slugify(title);
  const slug = `${sluggedTitle}-${cuid()}`;
  return slug.toLowerCase();
};

export default generateUniqueSlug;
