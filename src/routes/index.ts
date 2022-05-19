import express from 'express';
import mongoose from 'mongoose';
import { ENDPOINT_COMPLETED_MONGO } from '../settings';
import Route from './route';

const app = express();

app.use(express.json());
app.use(Route);

mongoose.connect(ENDPOINT_COMPLETED_MONGO).then(() => {
  console.log('Mongo Status -> Conectado')
}).catch(err => {console.log('Mongo Status -> Erro. Detalhes:\n', err)});


app.use((error: any, req: any, res: any, next: any) => {
  console.log('error middleware');
  res.sendStatus(500);
});

app.listen(3333, () => {
  console.log('Aplication Status -> Conectado')
});

export default app;

