"use strict";
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_SECRET_ACCESS_KEY = exports.AWS_ACCESS_KEY_ID = exports.AWS_DEFAULT_REGION = exports.AWS_BUCKET = exports.KEY_GOOGLE_MAPS = exports.ENDPOINT_GOOGLE_MAPS = exports.ENDPOINT_COMPLETED_MONGO = exports.ENVIROMENT_MONGO = exports.ENDPOINT_MONGO = exports.IS_DEV = void 0;
require("dotenv/config");
const process_1 = require("process");
// Ambiente
exports.IS_DEV = (_a = process_1.env.IS_DEV) !== null && _a !== void 0 ? _a : false;
exports.ENDPOINT_MONGO = (_b = process_1.env.ENDPOINT_MONGO) !== null && _b !== void 0 ? _b : 'mongodb://localhost:27017';
exports.ENVIROMENT_MONGO = exports.IS_DEV ? process_1.env.ENVIROMENT_DEV_MONGO : process_1.env.ENVIROMENT_PROD_MONGO;
exports.ENDPOINT_COMPLETED_MONGO = exports.ENDPOINT_MONGO + exports.ENVIROMENT_MONGO;
exports.ENDPOINT_GOOGLE_MAPS = 'https://maps.googleapis.com/maps/api/';
exports.KEY_GOOGLE_MAPS = (_c = process_1.env.KEY_GOOGLE_MAPS) !== null && _c !== void 0 ? _c : '';
exports.AWS_BUCKET = (_d = process_1.env.AWS_BUCKET) !== null && _d !== void 0 ? _d : '';
exports.AWS_DEFAULT_REGION = (_e = process_1.env.AWS_DEFAULT_REGION) !== null && _e !== void 0 ? _e : '';
exports.AWS_ACCESS_KEY_ID = (_f = process_1.env.AWS_ACCESS_KEY_ID) !== null && _f !== void 0 ? _f : '';
exports.AWS_SECRET_ACCESS_KEY = (_g = process_1.env.AWS_SECRET_ACCESS_KEY) !== null && _g !== void 0 ? _g : '';
