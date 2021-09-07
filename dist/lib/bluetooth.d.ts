import Bluez from "bluez";
export interface DiscoveredDevice {
    name: string;
    address: string;
}
export default class Bluetooth {
    private module;
    adapter: Bluez.Adapter;
    constructor();
    init(adapter?: string): Promise<void>;
    startDiscovery(): Promise<void>;
    stopDiscovery(): Promise<void>;
    discoverDevices(uuids?: string[]): Promise<DiscoveredDevice[]>;
    connect(address: string): Promise<Bluez.Device>;
    disconnect(device: Bluez.Device): Promise<void>;
}
