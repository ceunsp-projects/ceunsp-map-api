import 'dotenv/config';
import { env } from 'process';

// Ambiente
export const IS_DEV = env.IS_DEV ?? false;
export const force = true;
export const PORT = process.env.PORT || 3333;

export const ENDPOINT_MONGO = env.ENDPOINT_MONGO ?? 'mongodb://localhost:27017';
export const ENVIROMENT_MONGO = env.ENVIROMENT_PROD_MONGO;
export const ENDPOINT_COMPLETED_MONGO = ENDPOINT_MONGO + ENVIROMENT_MONGO;

export const ENDPOINT_GOOGLE_MAPS = 'https://maps.googleapis.com/maps/api/';
export const KEY_GOOGLE_MAPS = env.KEY_GOOGLE_MAPS ?? '';

export const AWS_BUCKET = env.AWS_BUCKET ?? '';
export const AWS_BUCKET_DEV = env.AWS_BUCKET_DEV ?? '';
export const AWS_DEFAULT_REGION = env.AWS_DEFAULT_REGION ?? '';
export const AWS_ACCESS_KEY_ID = env.AWS_ACCESS_KEY_ID ?? '';
export const AWS_SECRET_ACCESS_KEY = env.AWS_SECRET_ACCESS_KEY ?? '';
