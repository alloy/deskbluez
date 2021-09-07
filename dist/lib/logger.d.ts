export declare enum LEVEL {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}
export declare function setLevel(newLevel: LEVEL): void;
export declare function info(message: any, ...meta: any[]): void;
export declare function debug(message: any, ...meta: any[]): void;
export declare function warn(message: any, ...meta: any[]): void;
export declare function error(message: any, ...meta: any[]): void;
declare const _default: {
    info: typeof info;
    debug: typeof debug;
    warn: typeof warn;
    error: typeof error;
    setLevel: typeof setLevel;
    LEVEL: typeof LEVEL;
};
export default _default;
