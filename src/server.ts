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

process.on("unhandledRejection", (error) => {
  console.log(
    "Unhandled rejection error detected. Server is shutting down...",
    error
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.log(
    "uncaught exception error detected. Server is shutting down...",
    error
  );

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal found. Server is shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});

process.on("SIGINT", () => {
  console.log("SIGINT signal found. Server is shutting down...");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }

  process.exit(1);
});
