import mongoose from "mongoose";
import config from "../config";

const db = {
  connect: async () => {
    await mongoose
      .connect(
        `mongodb+srv://${config.USER_DB}:${config.PW_DB}@${config.URL_MONGO}/?retryWrites=true&w=majority`
      )
      .then(() => console.log(`mongodb connected!`));
  },
};

export default db;
