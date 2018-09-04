import dotenv from 'dotenv';

dotenv.config();

const config = {
  secret: process.env.SECRET,
  jwtSecret: process.env.JWT_TOKEN_SECRET,
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  }
};

export default config;
