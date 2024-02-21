import dotenv from "dotenv";
dotenv.config();
const config = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  REF_TOKEN_EXPIRY: process.env.REF_TOKEN_EXPIRY,
};
export default config;
