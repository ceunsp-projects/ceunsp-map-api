import { Request, Response } from 'express';
import { IS_DEV } from '../settings';

export async function ExceptionHandler(err: any, req: Request, res: Response): Promise<void> {
  if (IS_DEV) {
    console.error(err.status || 500);
    console.error(err.message);
    console.error(err.stack);
    console.log(req.headers);
    console.log(req.body);

    if (typeof err === 'string') {
      err = { message: err };
    }

    res.status(err.status || 500).send({
      message: err.message,
      stack: err.stack
    });

    return;
  }

  console.error(err);

  err.status = err.status || 500;
  res.status(err.status).send(err);
}
