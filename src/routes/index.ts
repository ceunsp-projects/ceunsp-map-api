import express from 'express';
import mongoose from 'mongoose';
import { ENDPOINT_COMPLETED_MONGO } from '../settings';
import Route from './route';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(Route);

mongoose.connect(ENDPOINT_COMPLETED_MONGO).then(() => {
  console.log('Mongo Status -> Conectado')
}).catch(err => {console.log('Mongo Status -> Erro. Detalhes:\n', err)});

process.on('unhandledRejection', err => {
  console.error('unhandledRejection', err);
  throw err;
});

process.on('uncaughtException', err => {
  console.error('uncaughtException', err);
  throw err;
});

app.use((error: any, req: any, res: any, next: any) => {
  console.log('error middleware -> ', error);
  const status = error.status;

  return res.status(status).json({
    status,
    message: error.message
  });
});

app.listen(process.env.PORT || 3333, () => {
  console.log('Aplication Status -> Conectado')
});

export default app;

