"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const settings_1 = require("../settings");
const route_1 = __importDefault(require("./route"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(route_1.default);
mongoose_1.default.connect(settings_1.ENDPOINT_COMPLETED_MONGO).then(() => {
    console.log('Mongo Status -> Conectado');
}).catch(err => { console.log('Mongo Status -> Erro. Detalhes:\n', err); });
app.use((error, req, res, next) => {
    console.log('error middleware -> ', error);
    const status = error.status;
    return res.status(status).json({
        status,
        message: error.message
    });
});
process.on('unhandledRejection', (reason, promise) => {
    console.error(reason);
    console.log(promise);
    throw new Error('ERRO');
});
process.on('uncaughtException', err => {
    console.error(err);
    throw new Error('ERRO');
});
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    process.exit(0);
}));
app.listen(process.env.PORT || 3333, () => {
    console.log('Aplication Status -> Conectado');
});
exports.default = app;
