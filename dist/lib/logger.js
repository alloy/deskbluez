"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = exports.debug = exports.info = exports.setLevel = exports.LEVEL = void 0;
var LEVEL;
(function (LEVEL) {
    LEVEL[LEVEL["ERROR"] = 0] = "ERROR";
    LEVEL[LEVEL["WARN"] = 1] = "WARN";
    LEVEL[LEVEL["INFO"] = 2] = "INFO";
    LEVEL[LEVEL["DEBUG"] = 3] = "DEBUG";
})(LEVEL = exports.LEVEL || (exports.LEVEL = {}));
let level = LEVEL.ERROR;
function setLevel(newLevel) {
    level = newLevel;
}
exports.setLevel = setLevel;
function info(message, ...meta) {
    if (level >= LEVEL.INFO)
        console.log("[INFO]", message, ...meta);
}
exports.info = info;
function debug(message, ...meta) {
    if (level >= LEVEL.DEBUG)
        console.debug("[DEBUG]", message, ...meta);
}
exports.debug = debug;
function warn(message, ...meta) {
    if (level >= LEVEL.WARN)
        console.warn("[WARN]", message, ...meta);
}
exports.warn = warn;
function error(message, ...meta) {
    if (level >= LEVEL.ERROR)
        console.error("[ERROR]", message, ...meta);
}
exports.error = error;
exports.default = { info, debug, warn, error, setLevel, LEVEL };
