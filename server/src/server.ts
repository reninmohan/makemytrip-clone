import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Regular middleware
app.use((_req, _res, next) => {
  console.log("This middleware runs first.");
  next();
});

app.use((req, res, next) => {
  console.log("This middleware will run second.");
  next();
});

// Routes

app.get("/", (_req, res) => {
  res.status(200).send("Hello this is the root '/' route.");
});

app.get("/error", (_req, res, next) => {
  try {
    throw new Error("this custom errror");
  } catch (error: unknown) {
    if (error instanceof Error) next(error);
    // res.status(200).send(error.message);
  }
});

app.all("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error-handling middleware
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  res.status(500).json({ error: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
