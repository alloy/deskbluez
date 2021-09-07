import { AbstractDesk, Command, DeskState, LENGTH_UNITS } from "./AbstractDesk";
export declare class LinakDesk extends AbstractDesk {
    private currentState;
    private transcoder;
    commands: () => Command[];
    subscribe(): Promise<void>;
    protected handleStateChangeNotification: (data: string) => void;
    offset(): number;
    total(): number;
    up(): Promise<void>;
    down(): Promise<void>;
    state(): Promise<DeskState>;
    stop(): Promise<void>;
    moveTo(position: number, unit: LENGTH_UNITS): any;
}
