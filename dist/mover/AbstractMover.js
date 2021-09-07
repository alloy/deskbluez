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
exports.AbstractMover = void 0;
const logger_1 = __importDefault(require("../lib/logger"));
class AbstractMover {
    constructor(state, position, absolute, unit, desk) {
        this.state = state;
        this.position = position;
        this.absolute = absolute;
        this.unit = unit;
        this.desk = desk;
    }
    get direction() {
        if (this.state.value < this.desiredPosition) {
            return "up";
        }
        else {
            return "down";
        }
    }
    wait(time) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("AB:MOVER: wait for", time);
            return new Promise(resolve => setTimeout(resolve, time));
        });
    }
}
exports.AbstractMover = AbstractMover;
