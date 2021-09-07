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
exports.ConfigManager = void 0;
const data_store_1 = __importDefault(require("data-store"));
const path_1 = require("path");
const os_1 = require("os");
const fs_1 = require("fs");
const logger_1 = __importDefault(require("./logger"));
class ConfigManager {
    constructor(profile) {
        this.profile = profile;
        this.path = (0, path_1.join)((0, os_1.homedir)(), ".config", `deskbluez-${this.profile}`);
        this.store = (0, data_store_1.default)({ path: this.path });
        logger_1.default.debug("CONFIG: load", { configPath: this.path, profile: this.profile });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            (0, fs_1.unlinkSync)(this.path);
        });
    }
    setConnectedDevice(device) {
        this.store.set("connectedDeviceName", device.name);
        this.store.set("connectedDeviceAddress", device.address);
        this.store.set("connectedDeviceModelName", device.modelName);
        logger_1.default.debug("CONFIG: set device", { profile: this.profile, device });
    }
    getConnectedDevice() {
        const name = this.store.get("connectedDeviceName");
        const address = this.store.get("connectedDeviceAddress");
        const modelName = this.store.get("connectedDeviceModelName");
        if (!name || !address || !modelName) {
            throw new Error(`No connected device stored under: ${this.profile}`);
        }
        logger_1.default.debug("CONFIG: get device", { profile: this.profile, name, address, modelName });
        return { name, address, modelName };
    }
}
exports.ConfigManager = ConfigManager;
