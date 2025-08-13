/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import { EnvVars } from "./app/config/env";
import app from "./app";
let server: Server;

const connectDb = async () => {
  try {
    await mongoose.connect(EnvVars.DB_URL);
    console.log("DB is connected...");

    server = app.listen(EnvVars.PORT, () => {
      console.log(`App is listening from port ${EnvVars.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  await connectDb();
})();
