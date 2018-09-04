import cloudinary from '../config/cloudinary';

export default (req, res, next) => {
  const { user } = JSON.parse(req.body.data);
  req.body.user = user;
  const { file } = req.files;
  if (!file) return next();
  return cloudinary.v2.uploader.upload(file.path, { tags: 'basic_sample' })
    .then((image) => {
      req.body.user.image = image.url;
      next();
    })
    .catch(() => res.status(500).send({
      success: false,
      errors: { error: ['Image could not be uploaded, please check your internet'] }
    }));
};
