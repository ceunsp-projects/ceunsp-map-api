import 'dotenv/config';
import { env } from 'process';

// Ambiente
export const IS_DEV = env.IS_DEV ?? false;

export const ENDPOINT_MONGO = env.ENDPOINT_MONGO ?? 'endpoint-local-mongo';
export const ENVIROMENT_MONGO = IS_DEV ? env.ENVIROMENT_DEV_MONGO : env.ENVIROMENT_PROD_MONGO;
export const ENDPOINT_COMPLETED_MONGO = ENDPOINT_MONGO + ENVIROMENT_MONGO;

export const ENDPOINT_GOOGLE_MAPS = 'https://maps.googleapis.com/maps/api/';
export const KEY_GOOGLE_MAPS = 'AIzaSyAlHb0pmC4B0A0J88bdhPQ6awv1X0GNB5s';
