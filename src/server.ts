import express, { Request, Response } from "express";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello from TypeScript + Express!" });
});

app.post("/echo", (req: Request, res: Response) => {
    res.json({ received: req.body });
});



export default app;