"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const multer_2 = __importDefault(require("../config/multer"));
const place_1 = __importDefault(require("../services/place"));
const Route = (0, express_1.Router)();
const upload = (0, multer_1.default)((0, multer_2.default)());
Route.get('/', (req, res) => {
    return res.json({ message: "Seja bem vindo!" });
});
// Place
Route.get('/places', place_1.default.list);
Route.get('/place/:id', place_1.default.details);
Route.post('/place/save', upload.single('place'), (req, res) => {
    return place_1.default.save(req, res, req.file);
});
exports.default = Route;
