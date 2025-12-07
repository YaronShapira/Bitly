import type { Request, Response, NextFunction } from 'express';

export const loggingMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    console.info(`${req.method} ${req.url} - ${res.statusCode} - ${Date.now() - start}ms`);
  });
  next();
};
