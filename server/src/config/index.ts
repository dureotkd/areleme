import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error('Couldnt Find .env File ❗');
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

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
    user_id: process.env.NAVER_USER_ID,
    user_pw: process.env.NAVER_USER_PW,
  },
  db: {
    host: process.env.DB_HOST,
    id: process.env.DB_ID,
    pw: process.env.DB_PW,
    name: process.env.DB_NAME,
  },
  solapi: {
    api_key: process.env.SOLAPI_API_KEY,
    secret_key: process.env.SOLAPI_SECRET_KEY,
  },
  ppurio: {
    api_key: process.env.PPURIO_API_KEY,
  },
};
