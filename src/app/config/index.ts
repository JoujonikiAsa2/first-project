import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV, 
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_pass: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expire_in: process.env.JWT_ACCESS_EXPIRE_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
  reset_pass_ui_link: process.env.RESET_PASS_UI_Link,
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET
};