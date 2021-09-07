/// <reference types="node" />
import Bluez from "bluez";
import { EventEmitter } from "events";
export interface Command {
    name: string;
    service: string;
    characteristic: string;
}
export declare enum DESK_EVENT {
    STATE_CHANGE = "stateChange"
}
export declare type DeskState = {
    value: number;
    cm: number;
    inch: number;
    pct: number;
    speed: number;
};
export declare type DeskEvent = DeskState;
export declare type DeskEventListener = (event: DeskEvent) => void;
export declare enum LENGTH_UNITS {
    CM = "cm",
    DESK = "desk",
    INC = "inch",
    PCT = "pct"
}
export declare abstract class AbstractDesk {
    readonly device: Bluez.Device;
    protected emitter: EventEmitter;
    constructor(device: Bluez.Device);
    getCommand(name: string): Command | null;
    getCharacteristic(name: string): Bluez.Characteristic;
    subscribe(): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    addListener(event: DESK_EVENT, listener: DeskEventListener): Promise<void>;
    removeListener(event: DESK_EVENT, listener: any): Promise<void>;
    abstract commands(): Command[];
    abstract up(): Promise<void>;
    abstract down(): Promise<void>;
    abstract stop(): Promise<void>;
    abstract moveTo(position: number, unit: LENGTH_UNITS): Promise<boolean>;
    abstract state(): Promise<DeskState>;
    abstract offset(): number;
    abstract total(): number;
    isSupported(): Promise<boolean>;
}
