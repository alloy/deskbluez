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
exports.LinakDesk = void 0;
const AbstractDesk_1 = require("./AbstractDesk");
const LinakMover_1 = require("../mover/LinakMover");
const LinakTranscoder_1 = require("../transcoder/LinakTranscoder");
const logger_1 = __importDefault(require("../lib/logger"));
var COMMANDS;
(function (COMMANDS) {
    COMMANDS["GET_CURRENT_STATE"] = "getCurrentState";
    COMMANDS["CONTROL"] = "control";
    COMMANDS["NOTIFICATION"] = "notification";
})(COMMANDS || (COMMANDS = {}));
class LinakDesk extends AbstractDesk_1.AbstractDesk {
    constructor() {
        super(...arguments);
        this.transcoder = new LinakTranscoder_1.LinakTranscoder(this);
        this.commands = () => [
            {
                name: COMMANDS.GET_CURRENT_STATE,
                service: "99fa0020-338a-1024-8a49-009c0215f78a",
                characteristic: "99fa0021-338a-1024-8a49-009c0215f78a"
            },
            {
                name: COMMANDS.CONTROL,
                service: "99fa0001-338a-1024-8a49-009c0215f78a",
                characteristic: "99fa0002-338a-1024-8a49-009c0215f78a"
            },
            {
                name: COMMANDS.NOTIFICATION,
                service: "99fa0020-338a-1024-8a49-009c0215f78a",
                characteristic: "99fa0021-338a-1024-8a49-009c0215f78a"
            }
        ];
        this.handleStateChangeNotification = (data) => {
            const position = this.transcoder.decodeState(data);
            this.emitter.emit(AbstractDesk_1.DESK_EVENT.STATE_CHANGE, position);
        };
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            const characteristic = this.getCharacteristic(COMMANDS.NOTIFICATION);
            logger_1.default.debug("LINAK:DESK: subscribe notifications");
            yield characteristic.StartNotify();
            // just to define the current state.
            this.currentState = yield this.state();
            characteristic.on("notify", this.handleStateChangeNotification);
        });
    }
    offset() {
        return 6150;
    }
    total() {
        return 6500;
    }
    up() {
        return __awaiter(this, void 0, void 0, function* () {
            const characteristic = this.getCharacteristic(COMMANDS.CONTROL);
            const value = this.transcoder.encodeUp();
            logger_1.default.debug("LINAK:DESK: handle UP, write value", COMMANDS.CONTROL, value);
            yield characteristic.WriteValue(value);
        });
    }
    down() {
        return __awaiter(this, void 0, void 0, function* () {
            const characteristic = this.getCharacteristic(COMMANDS.CONTROL);
            const value = this.transcoder.encodeDown();
            logger_1.default.debug("LINAK:DESK: handle DOWN, write value", COMMANDS.CONTROL, value);
            yield characteristic.WriteValue(this.transcoder.encodeDown());
        });
    }
    state() {
        return __awaiter(this, void 0, void 0, function* () {
            const characteristic = this.getCharacteristic(COMMANDS.GET_CURRENT_STATE);
            logger_1.default.debug("LINAK:DESK: request state...");
            const data = yield characteristic.ReadValue();
            const state = this.transcoder.decodeState(data);
            logger_1.default.debug("LINAK:DESK: received state:", state);
            return state;
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            const characteristic = this.getCharacteristic(COMMANDS.CONTROL);
            const value = this.transcoder.encodeStop();
            logger_1.default.debug("LINAK:DESK: handle STOP, write value", COMMANDS.CONTROL, value);
            yield characteristic.WriteValue(this.transcoder.encodeStop());
        });
    }
    moveTo(position, unit) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("LINAK:DESK: prepare move to", {
                position, unit
            });
            const mover = new LinakMover_1.LinakMover(this.currentState, position, true, unit, this);
            this.addListener(AbstractDesk_1.DESK_EVENT.STATE_CHANGE, mover.onStateChange);
            const completed = yield mover.perform();
            this.removeListener(AbstractDesk_1.DESK_EVENT.STATE_CHANGE, mover.onStateChange);
            return completed;
        });
    }
}
exports.LinakDesk = LinakDesk;
