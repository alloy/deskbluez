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
exports.createDesk = exports.getSupportedModel = exports.getDeskModel = exports.getSupportedDeskModels = void 0;
const REGISTRY_1 = __importDefault(require("./REGISTRY"));
function getSupportedDeskModels(device) {
    return __awaiter(this, void 0, void 0, function* () {
        const supported = [];
        for (let item of REGISTRY_1.default) {
            const desk = new item.cls(device);
            const isSupported = yield desk.isSupported();
            if (isSupported) {
                supported.push(item);
            }
        }
        return supported;
    });
}
exports.getSupportedDeskModels = getSupportedDeskModels;
function getDeskModel(name) {
    const [registry = null] = REGISTRY_1.default.filter(item => {
        return item.name = name;
    });
    if (registry === null) {
        throw new Error(`No desk registry found for: ${name}`);
    }
    else {
        return registry;
    }
}
exports.getDeskModel = getDeskModel;
function getSupportedModel(device) {
    return __awaiter(this, void 0, void 0, function* () {
        const [supportedModel = null] = yield getSupportedDeskModels(device);
        return supportedModel;
    });
}
exports.getSupportedModel = getSupportedModel;
function createDesk(model, device) {
    const desk = new model.cls(device);
    return desk;
}
exports.createDesk = createDesk;
