"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cocoSsd = __importStar(require("@tensorflow-models/coco-ssd"));
const tf = __importStar(require("@tensorflow/tfjs-node"));
const mobilenet = __importStar(require("@tensorflow-models/mobilenet"));
const lodash_1 = require("lodash");
const promises_1 = require("fs/promises");
const place_1 = __importDefault(require("../models/place"));
const api_1 = __importDefault(require("./api"));
const settings_1 = require("../settings");
const bubbleSort_1 = __importDefault(require("../helpers/bubbleSort"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const selectionSort_1 = __importDefault(require("../helpers/selectionSort"));
const v2_1 = require("@google-cloud/translate/build/src/v2");
const mongoose_1 = require("mongoose");
class PlaceService {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const places = yield place_1.default.find({}, { name: 1, pictures: 1, location: 1 });
            if (!(places === null || places === void 0 ? void 0 : places.length))
                return res.status(400).json({ message: 'Nenhum local foi identificado em nossa base.' });
            const sortedPlaces = (0, selectionSort_1.default)(places, (item) => item.name);
            return res.json(sortedPlaces !== null && sortedPlaces !== void 0 ? sortedPlaces : []);
        });
    }
    details(req, res) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_b = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : null;
            const isValidId = (0, mongoose_1.isValidObjectId)(id);
            if (!id || !isValidId)
                return res.status(400).json({ message: 'É necessário informar qual local deseja ver os detalhes.' });
            const place = yield place_1.default.findById(id, { name: 1, location: 1, items: 1 }).lean();
            if (!place)
                return res.status(400).json({ message: 'Esse local não existe em nossa base.' });
            const items = (0, bubbleSort_1.default)(place.items);
            return res.json((_c = Object.assign(Object.assign({}, place), { items })) !== null && _c !== void 0 ? _c : []);
        });
    }
    save(req, res, placePicture) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(placePicture === null || placePicture === void 0 ? void 0 : placePicture.location))
                return res.status(500).json({ message: 'Não foi possível salvar a foto!' });
            const placePath = !!(placePicture === null || placePicture === void 0 ? void 0 : placePicture.location) ? placePicture.location : placePicture.path;
            const { latitude, longitude } = req.body;
            if (!latitude || !longitude)
                return res.status(400).json({ message: 'Não foi possível encontrar a sua localização.' });
            const getLocation = yield api_1.default.googleGeocoding({
                method: 'GET',
                url: 'geocode/json',
                params: {
                    latlng: `${latitude},${longitude}`,
                    key: settings_1.KEY_GOOGLE_MAPS
                },
            });
            const result = (_a = getLocation === null || getLocation === void 0 ? void 0 : getLocation.results) === null || _a === void 0 ? void 0 : _a.reduce(((acc, result) => {
                var _a, _b, _c;
                const typesModified = (_a = result.address_components) === null || _a === void 0 ? void 0 : _a.map((x, index) => ({ types: x === null || x === void 0 ? void 0 : x.types, index }));
                const existPremise = typesModified === null || typesModified === void 0 ? void 0 : typesModified.find((modified) => { var _a; return (_a = modified === null || modified === void 0 ? void 0 : modified.types) === null || _a === void 0 ? void 0 : _a.includes('premise'); });
                if (existPremise) {
                    const location = (_b = result === null || result === void 0 ? void 0 : result.geometry) === null || _b === void 0 ? void 0 : _b.location;
                    if (!location)
                        return res.status(400).json({ message: 'Identificamos que você não está na CEUNSP.' });
                    acc.push({
                        name: (_c = result.address_components[existPremise === null || existPremise === void 0 ? void 0 : existPremise.index]) === null || _c === void 0 ? void 0 : _c.long_name,
                        location: {
                            latitude: location.lat,
                            longitude: location.lng
                        }
                    });
                }
                7;
                return acc;
            }), [])[0];
            const nameLocation = result === null || result === void 0 ? void 0 : result.name;
            const location = result === null || result === void 0 ? void 0 : result.location;
            if (!placePicture)
                return res.status(400).json({ message: 'Envie uma foto!' });
            if (!nameLocation || !location)
                return res.status(400).json({ message: 'Identificamos que você não está na CEUNSP.' });
            const [modelCocoSsd, modelMobileNet] = yield Promise.all([
                cocoSsd.load(),
                mobilenet.load()
            ]);
            let imageBuffer;
            if (placePicture === null || placePicture === void 0 ? void 0 : placePicture.location) {
                const response = yield (0, node_fetch_1.default)(placePath);
                imageBuffer = yield response.arrayBuffer();
            }
            else {
                imageBuffer = yield (0, promises_1.readFile)(placePath);
            }
            const imgTensor = tf.node.decodeImage(new Uint8Array(imageBuffer), 3);
            const cocoSsdPrediction = yield modelCocoSsd.detect(imgTensor);
            const mobileNetPrediction = yield modelMobileNet.classify(imgTensor);
            const predictions = [...cocoSsdPrediction, ...mobileNetPrediction];
            const translate = new v2_1.Translate({ key: settings_1.KEY_GOOGLE_MAPS });
            const newPredictions = yield predictions.reduce((previousPromise, item) => __awaiter(this, void 0, void 0, function* () {
                var _b, _c;
                const acc = yield previousPromise;
                const name = (item === null || item === void 0 ? void 0 : item.class) ? item.class : (_b = item === null || item === void 0 ? void 0 : item.className) !== null && _b !== void 0 ? _b : '';
                const nameSplited = name.split(',');
                const hasMoreThanOne = nameSplited.length > 1;
                if (hasMoreThanOne)
                    nameSplited.map((x) => __awaiter(this, void 0, void 0, function* () {
                        var _d;
                        const translatedName = yield translate.translate(x === null || x === void 0 ? void 0 : x.trim(), 'pt-br');
                        acc.push((_d = translatedName[0]) === null || _d === void 0 ? void 0 : _d.toLocaleLowerCase());
                        return x;
                    }));
                const translatedName = yield translate.translate(hasMoreThanOne ? nameSplited[0] : name, 'pt-br');
                acc.push((_c = translatedName[0]) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase());
                return acc;
            }), Promise.resolve([]));
            const filteredPredictions = (0, lodash_1.uniq)(newPredictions);
            if (!nameLocation)
                return res.status(400).json({ message: 'Não foi possível identificar em qual local da faculdade você está.' });
            let place = yield place_1.default.findOneAndUpdate({ name: nameLocation }, {
                $set: { location },
                $addToSet: { items: { $each: filteredPredictions }, pictures: { $each: [placePath] } },
            });
            if (!place)
                place = yield place_1.default.create({
                    name: nameLocation,
                    location,
                    items: filteredPredictions,
                    pictures: [placePath]
                });
            return res.json({ place, placePicture });
        });
    }
}
const placeService = new PlaceService();
exports.default = placeService;
