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
const bluez_1 = __importDefault(require("bluez"));
const logger_1 = __importDefault(require("./logger"));
class Bluetooth {
    constructor() {
        this.module = new bluez_1.default();
        this.adapter = null;
    }
    init(adapter = "hci0") {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("BLUETOOTH: init");
            yield this.module.init();
            logger_1.default.debug("BLUETOOTH: use adapter", adapter);
            this.adapter = yield this.module.getAdapter(adapter);
            logger_1.default.debug("BLUETOOTH: adapter loaded", yield this.adapter.getProperties());
        });
    }
    startDiscovery() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("BLUETOOTH: start discovery");
            return this.adapter.StartDiscovery();
        });
    }
    stopDiscovery() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("BLUETOOTH: stop discovery");
            return this.adapter.StopDiscovery();
        });
    }
    discoverDevices(uuids = []) {
        return __awaiter(this, void 0, void 0, function* () {
            const devices = [];
            const listener = (address, props) => {
                logger_1.default.debug("BLUETOOTH: device discovered", address, props);
                devices.push({
                    address,
                    name: props.Name || "untitled"
                });
            };
            yield this.adapter.SetDiscoveryFilter({ UUIDs: uuids });
            yield this.startDiscovery();
            this.module.on('device', listener);
            yield new Promise(resolve => setTimeout(resolve, 5000));
            yield this.stopDiscovery();
            this.module.removeListener("device", listener);
            if (devices.length === 0) {
                throw new Error("No devices found");
            }
            return devices;
        });
    }
    connect(address) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("BLUETOOTH: connect to", address);
            return this.module.getDevice(address);
        });
    }
    disconnect(device) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("BLUETOOTH: disconnect device", yield device.Address());
            yield device.Disconnect();
            yield this.adapter.RemoveDevice(device);
        });
    }
}
exports.default = Bluetooth;
