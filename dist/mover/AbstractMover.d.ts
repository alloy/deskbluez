import { AbstractDesk, DeskState, LENGTH_UNITS } from "../desks/AbstractDesk";
export declare abstract class AbstractMover {
    protected state: DeskState;
    protected position: number;
    protected absolute: boolean;
    protected unit: LENGTH_UNITS;
    protected desk: AbstractDesk;
    constructor(state: DeskState, position: number, absolute: boolean, unit: LENGTH_UNITS, desk: AbstractDesk);
    abstract onStateChange(position: DeskState): any;
    abstract perform(): Promise<boolean>;
    abstract get desiredPosition(): number;
    protected get direction(): "up" | "down";
    protected wait(time: number): Promise<void>;
}
