/// <reference types="node" />
import { AbstractTranscoder } from "./AbstractTranscoder";
import { DeskState } from "../desks/AbstractDesk";
export declare class LinakTranscoder extends AbstractTranscoder {
    decodeState(data: ArrayBuffer | Buffer | String): DeskState;
    encodeDown(): number[];
    encodeUp(): number[];
    encodeStop(): number[];
}
