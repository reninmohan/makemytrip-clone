import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const unknownRouteHandler = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    status: "error",
    message: `Cannot ${req.method} ${req.path}`,
    timestamp: new Date().toISOString(),
  });
};

export default unknownRouteHandler;
