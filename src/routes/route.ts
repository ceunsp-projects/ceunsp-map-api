import { Router } from 'express';
import predictionService from '../services/prediction';

const Route = Router();

Route.get('/', (req, res) => {
  return res.json({ message: "Seja bem vindo!"});
});

Route.get('/predictions', predictionService.getPrediction);

export default Route;
