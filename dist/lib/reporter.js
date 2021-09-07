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
Object.defineProperty(exports, "__esModule", { value: true });
function reportServices(device) {
    return __awaiter(this, void 0, void 0, function* () {
        const report = {};
        const uuids = (yield device.getProperties()).UUIDs;
        for (let uuid of uuids) {
            const service = yield device.getService(uuid);
            if (!service)
                continue;
            const serviceProps = yield service.getProperties();
            serviceProps.Characteristics = yield reportCharacteristics(service);
            report[uuid] = serviceProps;
        }
        return report;
    });
}
function reportCharacteristics(service) {
    return __awaiter(this, void 0, void 0, function* () {
        const report = {};
        const uuids = Object.keys(service.characteristics);
        for (let uuid of uuids) {
            const char = yield service.getCharacteristic(uuid);
            const charProps = yield char.getProperties();
            charProps.Descriptors = yield reportDescriptors(char);
            report[uuid] = charProps;
        }
        return report;
    });
}
function reportDescriptors(char) {
    return __awaiter(this, void 0, void 0, function* () {
        const report = {};
        const uuids = yield Object.keys(char.descriptors);
        for (let uuid of uuids) {
            const desc = yield char.getDescriptor(uuid);
            const descProps = yield desc.getProperties();
            report[uuid] = descProps;
        }
        return report;
    });
}
function default_1(bluetooth, device) {
    return __awaiter(this, void 0, void 0, function* () {
        const properties = yield device.getProperties();
        const adapter = yield bluetooth.adapter.getProperties();
        const services = yield reportServices(device);
        return {
            Adapter: adapter,
            Properties: properties,
            Services: services
        };
    });
}
exports.default = default_1;
