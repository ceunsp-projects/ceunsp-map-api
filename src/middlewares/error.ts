import { NextFunction, Request, Response } from 'express';

export default function errorParser(err: any, req: Request, res: Response, next: NextFunction): any {
  if (err.validationError) {
    return res.status(400).json(err.message);
  }

  if (err.status && err.status !== 500) {
    return res.status(err.status).json(err);
  }

  next(err);
}
