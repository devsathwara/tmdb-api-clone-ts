import app from "./app";
import config from "./src/config/config";

app.listen(config.env.app.port, () => {
  console.log(`Server is running on port ${config.env.app.port}`);
});
