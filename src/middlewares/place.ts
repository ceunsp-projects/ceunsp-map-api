import { NextFunction, Request, Response } from 'express';
import { PlaceValidator } from '../validators/place';

export const PlaceCreateMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const validator = await PlaceValidator.validateAsync({ ...req.body });

  console.log(validator)
  return res.status(400).json(validator);

  next();
};
