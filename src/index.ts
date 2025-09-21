import app from "./server";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { error } from "console";

// Initialize environment variables
dotenv.config();

const mongoUri: string | undefined = process.env.mongodburi;
if (!mongoUri) {
  throw new Error("Environment variable 'mongodburi' is not set.");
}

const startServer = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);
    console.log("mongodbconnected");
    const port: number = process.env.PORT ? Number(process.env.PORT) : 3000;
    app.listen(port, () => {
      console.log(`Server running: http://localhost:${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer().catch((error) => {
  console.log("server Error");
  process.exit(1);
});
