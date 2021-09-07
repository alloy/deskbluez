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
exports.AbstractDesk = exports.LENGTH_UNITS = exports.DESK_EVENT = void 0;
const events_1 = require("events");
const logger_1 = __importDefault(require("../lib/logger"));
const errors_1 = require("./errors");
var DESK_EVENT;
(function (DESK_EVENT) {
    DESK_EVENT["STATE_CHANGE"] = "stateChange";
})(DESK_EVENT = exports.DESK_EVENT || (exports.DESK_EVENT = {}));
var LENGTH_UNITS;
(function (LENGTH_UNITS) {
    LENGTH_UNITS["CM"] = "cm";
    LENGTH_UNITS["DESK"] = "desk";
    LENGTH_UNITS["INC"] = "inch";
    LENGTH_UNITS["PCT"] = "pct";
})(LENGTH_UNITS = exports.LENGTH_UNITS || (exports.LENGTH_UNITS = {}));
class AbstractDesk {
    constructor(device) {
        this.device = device;
        this.emitter = new events_1.EventEmitter();
    }
    getCommand(name) {
        const commands = this.commands()
            .filter(command => command.name === name);
        if (commands.length) {
            logger_1.default.debug("AB:DESK: requested command", commands[0]);
            return commands[0];
        }
        else {
            logger_1.default.warn("AB:DESK: requested not existing command", name);
            return null;
        }
    }
    getCharacteristic(name) {
        const command = this.getCommand(name);
        const service = this.device.getService(command.service);
        if (!service) {
            throw new errors_1.UnsupportedServiceError(`Service ${name} [${command.service}] not available.`);
        }
        logger_1.default.debug("AB:DESK: request characteristic", name);
        return service.getCharacteristic(command.characteristic);
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new errors_1.NotSupportedError("Notification aren't supported");
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("AB:DESK: connecting...");
            yield this.device.Connect();
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("AB:DESK: disconnecting...");
            yield this.device.Disconnect();
        });
    }
    addListener(event, listener) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("AB:DESK: register event listener", event);
            this.emitter.addListener(event, listener);
        });
    }
    removeListener(event, listener) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("AB:DESK: remove event listener", event);
            this.emitter.removeListener(event, listener);
        });
    }
    isSupported() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const command of this.commands()) {
                const service = this.device.getService(command.service);
                if (!service) {
                    logger_1.default.debug("No service found, command not supported", {
                        device: yield this.device.Address(),
                        command,
                    });
                    return false;
                }
                const characteristic = service.getCharacteristic(command.characteristic);
                if (!characteristic) {
                    logger_1.default.debug("No characteristic found, command not supported", {
                        device: yield this.device.Address(),
                        command,
                    });
                    return false;
                }
            }
            return true;
        });
    }
    ;
}
exports.AbstractDesk = AbstractDesk;
