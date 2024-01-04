import dotenv from "dotenv";
import { any } from "zod";

dotenv.config();
export const config = {
  env: {
    app: {
      port: process.env.PORT || "3000",
      secret: process.env.SECRET || "defaultSecret",
      expiresIn: process.env.EXPIREIN || "1d",
      email: process.env.EMAIL || "example@example.com",
      cookieExpiration: new Date(Date.now() + 24 * 60 * 60 * 1000),
      database: process.env.DATABASE || "",
      host: process.env.HOST || "localhost",
      user: process.env.USER || "root",
      sqlPort: process.env.SQLPORT || 3306,
      emailPort: process.env.EMAILPORT || 2525,
      emailHost: process.env.EMAILHOST,
      emailUser: process.env.EMAILUSER || "",
      emailPass: process.env.EMAILPASS || "",
      appUrl: process.env.APP_URL || "",
      tmdbApiKey: process.env.TMDB_API_KEY || "",
      ApiUrl: process.env.API_URL,
    },
  },
};
export default config;
