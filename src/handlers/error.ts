import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res) => {
  console.log();

  res.status(500);
  return res.render('error', { error: err });
}

export default errorHandler;
