import express from "express";
import cors from "cors";
import config from "./config";
import db from "./db";
import routes from "./routes";
const app = express();
db.connect();

app.use(cors());
app.use(express.json());
routes.use(app);
app.get("/", (req, res) => {
  res.send("from wibusama without love 🖕");
});

app.listen(config.PORT, () => {
  return console.log(`Server is running at http://localhost:${config.PORT}`);
});
