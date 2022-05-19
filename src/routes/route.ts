import { randomUUID } from 'crypto';
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import placeService from '../services/place';

const Route = Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'tmp/')
  },
  filename(req, file, cb) {
    cb(null, randomUUID() + path.extname(file.originalname))
  }
});

const upload = multer({ storage });

Route.get('/', (req, res) => {
  return res.json({ message: "Seja bem vindo!"});
});

// Place
Route.get('/places', placeService.get);
Route.post('/place/save', upload.single('place'), placeService.save);

export default Route;
