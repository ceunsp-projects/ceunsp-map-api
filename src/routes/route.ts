import { Router } from 'express';
import multer from 'multer';
import multerConfig from '../config/multer';
import placeService, { MulterExpressFile } from '../services/place';

const Route = Router();

const upload = multer(multerConfig());

Route.get('/', (req, res) => {
  return res.json({ message: "Seja bem vindo!"});
});

// Place
Route.get('/places', placeService.list);
Route.get('/place/:id', placeService.details);
Route.post('/place/save', upload.single('place'), (req, res) => {
  return placeService.save(req, res, req.file as MulterExpressFile)
});

export default Route;
