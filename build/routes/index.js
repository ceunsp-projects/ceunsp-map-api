"use strict";
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
    res.sendStatus(500);
});
app.listen(3333, () => {
    console.log('Aplication Status -> Conectado');
});
exports.default = app;
