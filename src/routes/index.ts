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

app.use((error: any, req: any, res: any, next: any) => {
  console.log('error middleware -> ', error);
  const status = error.status;

  return res.status(status).json({
    status,
    message: error.message
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(reason);
  console.log(promise);

  throw new Error('ERRO');
});

process.on('uncaughtException', err => {
  console.error(err);

  throw new Error('ERRO');
});

process.on('SIGTERM', async () => {
  process.exit(0);
});

app.listen(process.env.PORT || 3333, () => {
  console.log('Aplication Status -> Conectado')
});

export default app;

