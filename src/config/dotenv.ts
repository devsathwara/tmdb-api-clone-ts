import dotenv from "dotenv";
dotenv.config();
export const config = {
  env: {
    app: {
      port: process.env.PORT,
      secret: "tmbdb-secret-key",
      expiresIn: "24h",
      email: "info@tmdb.com",
      cookieExpiration: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
};
export default config;
