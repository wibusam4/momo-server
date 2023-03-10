import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  USER_DB: process.env.USER_DB || "wibune",
  PW_DB: process.env.PW_DB || "password",
  URL_MONGO: process.env.URL_MONGO || "link",
  JWT_SECRET: process.env.JWT_SECRET || "wibu@sama!21*04&",
};

export default config;
