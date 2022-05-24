import aws from 'aws-sdk';
import { randomUUID } from 'crypto';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { AWS_ACCESS_KEY_ID, AWS_BUCKET, AWS_DEFAULT_REGION, AWS_SECRET_ACCESS_KEY, IS_DEV } from '../settings';

export default function multerConfig() {
  aws.config.update({
      secretAccessKey: AWS_SECRET_ACCESS_KEY,
      accessKeyId: AWS_ACCESS_KEY_ID,
      region: AWS_DEFAULT_REGION,
  });

  const storages = {
    dev: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, 'tmp/')
      },
      filename(req, file, cb) {
        cb(null, randomUUID() + path.extname(file.originalname))
      }
    }),
    prod: multerS3({
      s3: new aws.S3(),
      bucket: AWS_BUCKET,
      acl: 'public-read',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => cb(null, randomUUID() + path.extname(file.originalname)),
    })
  };

  return {
    dest: path.resolve(__dirname, '..', '..', 'tmp') ,
    storage: storages[IS_DEV ? 'dev' : 'prod']
  }
};
