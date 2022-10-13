import cors from 'cors';
import express from 'express';
import * as http from 'http';
import mongoose from 'mongoose';
import errorParser from './middlewares/error';
import { ExceptionHandler } from './middlewares/exceptionHandler';
import Route from './routes';
import { ENDPOINT_COMPLETED_MONGO, PORT } from './settings';

export let server: http.Server;

const Server = () => {
  mongoose.connect(ENDPOINT_COMPLETED_MONGO).then(() => {
    console.log('Mongo Status -> Conectado')
  }).catch(err => {console.log('Mongo Status -> Erro. Detalhes:\n', err)});

  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true }));

  app.use(Route);

  app.use(errorParser);
  app.use(ExceptionHandler);

  server = app.listen(PORT, () => console.log(`Aplication Status Port: ${PORT} -> Conectado`));
  //Disabling node keep alive timeout
  server.keepAliveTimeout = 0;

  process.on('unhandledRejection', (reason: any, p: any) => {
    console.error('unhandledRejection');
    console.error(reason);
    console.error(p);
  });

  process.on('SIGTERM', async () => {
    console.log('SIGTERM');
    await mongoose.disconnect();
    mongoose.connection.close(true, async () => {
      console.log('MongoDb connection closed.');
      process.exit(0);
    });
  });

  process.on('exit', function (code) {
    console.log(`About to exit with code ${code}`);
  });

  return app;
}

export default Server();
