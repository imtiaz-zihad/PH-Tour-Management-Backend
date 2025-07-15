
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tour-management-db:tour-db-backend-api@cluster0.x6gil.mongodb.net/tour-management-backend?retryWrites=true&w=majority&appName=Cluster0"
    );

    console.log("Connected to MongoDB successfully");

    server = app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();

/**
 * unhandleed Rejection error
 * 
 */
