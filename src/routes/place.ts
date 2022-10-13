import { Router } from 'express';
import { PlaceCreateMiddleware } from '../middlewares/place';
import { UploadMiddleware } from '../middlewares/upload';
import placeService, { MulterExpressFile } from '../services/place';

const PlacesRoutes = Router();


// Place
PlacesRoutes.get('/', placeService.list);
PlacesRoutes.get('/:id', placeService.details);

PlacesRoutes.post('/save', PlaceCreateMiddleware, placeService.save)

// deprecated
PlacesRoutes.post('/save/deprecated', UploadMiddleware('place'), (req, res) => {
  return placeService.saveDeprecated(req, res, req.file as MulterExpressFile)
});

export default PlacesRoutes;
