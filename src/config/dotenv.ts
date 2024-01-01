import dotenv from "dotenv";
dotenv.config();
export const config = {
  env: {
    app: {
      port: process.env.PORT,
      secret: "tmbdb-secret-key",
      expiresIn: "1h",
    },
  },
};
export default config;
