"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinakTranscoder = void 0;
const AbstractTranscoder_1 = require("./AbstractTranscoder");
const binary_1 = __importDefault(require("binary"));
class LinakTranscoder extends AbstractTranscoder_1.AbstractTranscoder {
    decodeState(data) {
        let unpackedData;
        if (typeof data === "string") {
            unpackedData = this.unpack(data);
        }
        else {
            unpackedData = data;
        }
        const { value, speed } = binary_1.default.parse(unpackedData)
            .word16lu("value")
            .word16ls("speed")
            .vars;
        const absoluteHeight = value + this.desk.offset();
        const cm = absoluteHeight / 100;
        const inch = absoluteHeight / 100 / 2.54;
        const pct = value / (this.desk.total() / 100);
        return {
            value, cm, inch, pct, speed
        };
    }
    encodeDown() {
        return this.hexToBytes("4600");
    }
    encodeUp() {
        return this.hexToBytes("4700");
    }
    encodeStop() {
        return this.hexToBytes("FF00");
    }
}
exports.LinakTranscoder = LinakTranscoder;
