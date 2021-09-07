import Bluez from "bluez";
import { DeskModelItem } from "./desks/types";
import { AbstractDesk } from "./desks/AbstractDesk";
export declare function getSupportedDeskModels(device: Bluez.Device): Promise<DeskModelItem[]>;
export declare function getDeskModel(name: string): DeskModelItem;
export declare function getSupportedModel(device: Bluez.Device): Promise<DeskModelItem | null>;
export declare function createDesk(model: DeskModelItem, device: Bluez.Device): AbstractDesk;
