"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedServiceError = exports.NotSupportedError = exports.BaseDeskError = void 0;
class BaseDeskError extends Error {
    constructor(message) {
        const trueProto = new.target.prototype;
        super(message);
        Object.setPrototypeOf(this, trueProto);
    }
}
exports.BaseDeskError = BaseDeskError;
class NotSupportedError extends BaseDeskError {
}
exports.NotSupportedError = NotSupportedError;
class UnsupportedServiceError extends BaseDeskError {
}
exports.UnsupportedServiceError = UnsupportedServiceError;
