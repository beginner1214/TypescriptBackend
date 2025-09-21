import express, { Request, Response } from "express";
import router from "./Router";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/", router());


export default app;
