import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const unknownRoute = (req: Request, res: Response, _next: NextFunction) => {
  const errorResponse = {
    status: "error",
    statusCode: 404,
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  };
  console.error("Accessing unregistered route.");
  console.log(errorResponse);

  res.status(404).json(errorResponse);
};
