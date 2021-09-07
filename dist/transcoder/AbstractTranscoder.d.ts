/// <reference types="node" />
import { AbstractDesk, DeskState } from "../desks/AbstractDesk";
export declare abstract class AbstractTranscoder {
    protected desk: AbstractDesk;
    constructor(desk: AbstractDesk);
    abstract decodeState(data: ArrayBuffer | Buffer | String): DeskState;
    abstract encodeUp(): number[];
    abstract encodeDown(): number[];
    abstract encodeStop(): number[];
    protected hexToBytes: (hex: string) => any[];
    protected unpack: (data: string) => Buffer;
}
