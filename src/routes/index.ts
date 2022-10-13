import { Router } from 'express';
import PlacesRoutes from './place';

const Route = Router();

Route.use('/places', PlacesRoutes);

export default Route;
