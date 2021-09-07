export declare class CommandLine {
    private profile;
    private adapter;
    private bluetooth;
    private config;
    constructor();
    parse(argv: string[]): void;
    private actionReport;
    private actionDisconnect;
    private actionConnect;
    private actionStatus;
    private actionMoveUp;
    private actionMoveDown;
    private actionMoveTo;
    private decorate;
    private connectDesk;
    private preAction;
    private onActionEnd;
    private onActionError;
    private parsePositionString;
}
