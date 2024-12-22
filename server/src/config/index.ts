import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("Couldnt Find .env File ❗");
}

export default {
  port: process.env.PORT,
  logs: {
    level: process.env.LOG_LEVEL || "silly",
  },
  api: {
    prefix: "/api",
  },
  db: {
    host: process.env.DB_HOST,
    id: process.env.DB_ID,
    pw: process.env.DB_PW,
    name: process.env.DB_NAME,
  },
};
