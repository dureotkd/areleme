import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error('Couldnt Find .env File ❗');
}

export default {
  port: process.env.PORT,
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },
  api: {
    prefix: '/api',
  },
  kakao: {
    app_key: process.env.APP_KEY,
    rest_api_key: process.env.REST_API_KEY,
    js_key: process.env.JS_KEY,
    admin_key: process.env.ADMIN_KEY,
  },
  naver: {
    access_key: process.env.NAVER_ACCESS_KEY,
    secret_key: process.env.NAVER_SECRET_KEY,
  },
  db: {
    host: process.env.DB_HOST,
    id: process.env.DB_ID,
    pw: process.env.DB_PW,
    name: process.env.DB_NAME,
  },
};
