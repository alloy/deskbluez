"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTranscoder = void 0;
class AbstractTranscoder {
    constructor(desk) {
        this.desk = desk;
        this.hexToBytes = (hex) => {
            const result = [];
            for (var i = 0; i < hex.length; i += 2) {
                result.push(parseInt(hex.substr(i, 2), 16));
            }
            return result;
        };
        this.unpack = (data) => {
            const arrayBuffer = Buffer.alloc(data.length);
            for (var i = 0; i < data.length; i++) {
                var char = ("" + data[i]).charCodeAt(0);
                arrayBuffer[i] = char;
            }
            return arrayBuffer;
        };
    }
}
exports.AbstractTranscoder = AbstractTranscoder;
