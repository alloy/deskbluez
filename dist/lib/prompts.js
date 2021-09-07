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
exports.chooseModel = exports.confirmPairingMode = exports.confirmDisconnection = exports.chooseDevice = void 0;
const prompts_1 = __importDefault(require("prompts"));
const REGISTRY_1 = __importDefault(require("../REGISTRY"));
function chooseDevice(devices) {
    return __awaiter(this, void 0, void 0, function* () {
        const { device = null } = yield (0, prompts_1.default)([
            {
                type: "select",
                name: "device",
                message: "choose desk device",
                choices: devices.map(device => {
                    return {
                        title: `${device.name} [${device.address}]`,
                        value: device
                    };
                })
            }
        ]);
        if (device === null) {
            throw new Error("No device selected");
        }
        return device;
    });
}
exports.chooseDevice = chooseDevice;
function confirmDisconnection() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, prompts_1.default)([
            {
                type: "confirm",
                name: "disconnected",
                message: "make sure the desk device isn't paired OR connected",
                onState: ({ value }) => (value === false ? process.exit() : null)
            },
        ]);
    });
}
exports.confirmDisconnection = confirmDisconnection;
function confirmPairingMode() {
    return __awaiter(this, void 0, void 0, function* () {
        return (0, prompts_1.default)([
            {
                type: "confirm",
                name: "pairing",
                message: "enable the pairing mode (usually hold bluetooth button for 2-3 seconds)",
                onState: ({ value }) => (value === false ? process.exit() : null)
            }
        ]);
    });
}
exports.confirmPairingMode = confirmPairingMode;
function chooseModel() {
    return __awaiter(this, void 0, void 0, function* () {
        const { model = null } = yield (0, prompts_1.default)([
            {
                type: "select",
                name: "model",
                message: "choose device model:",
                choices: REGISTRY_1.default.map(model => {
                    return {
                        title: `${model.name}`,
                        value: model
                    };
                })
            }
        ]);
        if (model === null) {
            throw new Error("No desk model selected");
        }
        else {
            return model;
        }
    });
}
exports.chooseModel = chooseModel;
