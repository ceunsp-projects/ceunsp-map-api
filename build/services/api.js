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
const axios_1 = __importDefault(require("axios"));
const settings_1 = require("../settings");
class ApiService {
    constructor() {
        this.client = axios_1.default;
    }
    googleGeocoding(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.createRequest(settings_1.ENDPOINT_GOOGLE_MAPS, {}, config);
            return result.data;
        });
    }
    createRequest(baseURL, headers, config) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.client(Object.assign(Object.assign({}, config), { baseURL, headers: Object.assign(Object.assign({}, headers), (config.headers || {})) }));
        });
    }
}
const apiService = new ApiService();
exports.default = apiService;
