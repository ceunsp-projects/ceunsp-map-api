"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const crypto_1 = require("crypto");
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const path_1 = __importDefault(require("path"));
const settings_1 = require("../settings");
function multerConfig() {
    aws_sdk_1.default.config.update({
        secretAccessKey: settings_1.AWS_SECRET_ACCESS_KEY,
        accessKeyId: settings_1.AWS_ACCESS_KEY_ID,
        region: settings_1.AWS_DEFAULT_REGION,
    });
    const storages = {
        dev: multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, 'tmp/');
            },
            filename(req, file, cb) {
                cb(null, (0, crypto_1.randomUUID)() + path_1.default.extname(file.originalname));
            }
        }),
        prod: (0, multer_s3_1.default)({
            s3: new aws_sdk_1.default.S3(),
            bucket: settings_1.IS_DEV ? settings_1.AWS_BUCKET_DEV : settings_1.AWS_BUCKET,
            acl: 'public-read',
            contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => cb(null, (0, crypto_1.randomUUID)() + path_1.default.extname(file.originalname)),
        })
    };
    return {
        dest: path_1.default.resolve(__dirname, '..', '..', 'tmp'),
        storage: storages['prod']
    };
}
exports.default = multerConfig;
;
