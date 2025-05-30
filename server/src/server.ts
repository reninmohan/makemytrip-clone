import ENV from "./config/env.config.js";
import app from "./app.js";
import { connectDB, disconnectDB } from "./db/config/db.connection.js";
import { Server } from "http";

const PORT = Number(ENV.PORT) || 3000;
let server: Server | null = null;

const startServer = async () => {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Express started running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Forcefully shutting down server...", error);
    process.exit(1);
  }
};

//Server starts from here.
startServer();

//run shutdown fn incase of app crash by terminal or promise rejection case.
const shutdown = async (): Promise<void> => {
  if (server) {
    console.log("Shutting down server...");
    //Stop accepting new connection request and waits for ongoing requests to complete then run
    server.close(async () => {
      await disconnectDB();
      console.log("Server and database connections closed successfully");
      process.exit(0);
    });

    setTimeout(() => {
      console.log("Forcefully shutting down server....");
      process.exit(1);
    }, 10000);
  } else {
    await disconnectDB();
    console.log("Server was not running, but database connection was closed successfully.");
    process.exit(0);
  }
};

// event handler
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
process.on("unhandledRejection", (error) => {
  if (error instanceof Error) console.error("Unhandled Rejection Occured", error.message);
  shutdown();
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack || err.message);
  shutdown();
});
