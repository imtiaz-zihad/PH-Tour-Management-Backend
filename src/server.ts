/* eslint-disable no-console */

import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);

    console.log("Connected to MongoDB successfully");

    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin();
})();

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection, Shutting down the server", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception  Rejection, Shutting down the server", err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});

process.on("SIGTERM", () => {
  console.log("SIGTERM signal recive.., Shutting down the server");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT signal recive.., Shutting down the server");

  if (server) {
    server.close(() => {
      process.exit(1);
    });
    process.exit(1);
  }
});

// Unhandled Rejection  handling
//Promise.reject(new Error("Unhandled Rejection Error"));

// Uncaught Exception handling
//throw new Error("Uncaught Exception Error");

/**
 * unhandleed Rejection error
 * uncaught rejection error
 * signal termination
 */
