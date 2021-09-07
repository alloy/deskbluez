import Bluez from "bluez";
import Bluetooth from "./bluetooth";
interface DeviceReport {
    Adapter: any;
    Properties: any;
    Services: any;
}
export default function (bluetooth: Bluetooth, device: Bluez.Device): Promise<DeviceReport>;
export {};
