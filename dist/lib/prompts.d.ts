import prompts from "prompts";
import { DeskModelItem } from "../desks/types";
import { DiscoveredDevice } from "./bluetooth";
export declare function chooseDevice(devices: DiscoveredDevice[]): Promise<DiscoveredDevice>;
export declare function confirmDisconnection(): Promise<prompts.Answers<"disconnected">>;
export declare function confirmPairingMode(): Promise<prompts.Answers<"pairing">>;
export declare function chooseModel(): Promise<DeskModelItem>;
