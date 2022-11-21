import multer from 'multer';
import multerConfig from '../config/multer';

const upload = multer(multerConfig());

export const UploadMiddleware = (name: string) => () => {
  return upload.single(name)
}
