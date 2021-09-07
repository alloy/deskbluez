interface ConnectedDevice {
    name: string;
    address: string;
    modelName: string;
}
export declare class ConfigManager {
    private profile;
    private store;
    private path;
    constructor(profile: string);
    delete(): Promise<void>;
    setConnectedDevice(device: ConnectedDevice): void;
    getConnectedDevice(): ConnectedDevice;
}
export {};
