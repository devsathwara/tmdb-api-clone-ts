import dotenv from "dotenv";
dotenv.config();
export const config = {
  env: {
    app: {
      port: process.env.PORT,
    },
  },
};
