"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandLine = void 0;
const commander_1 = require("commander");
const treeify_1 = __importDefault(require("treeify"));
const version_json_1 = require("../version.json");
const bluetooth_1 = __importDefault(require("./bluetooth"));
const config_1 = require("./config");
const factory = __importStar(require("../factory"));
const logger_1 = __importDefault(require("./logger"));
const prompts = __importStar(require("./prompts"));
const AbstractDesk_1 = require("../desks/AbstractDesk");
const reporter_1 = __importDefault(require("./reporter"));
const progress_1 = __importDefault(require("progress"));
class CommandLine {
    constructor() {
        this.actionReport = () => __awaiter(this, void 0, void 0, function* () {
            yield prompts.confirmDisconnection();
            yield prompts.confirmPairingMode();
            const devices = yield this.bluetooth.discoverDevices();
            const device = yield prompts.chooseDevice(devices);
            const bluetoothDevice = yield this.bluetooth.connect(device.address);
            yield bluetoothDevice.Pair();
            let paired = false;
            console.log("Waiting for pairing ...");
            while (!paired) {
                paired = yield bluetoothDevice.Paired();
            }
            const report = yield (0, reporter_1.default)(this.bluetooth, bluetoothDevice);
            yield this.bluetooth.disconnect(bluetoothDevice);
            console.log(treeify_1.default.asTree(report, true, true));
        });
        this.actionDisconnect = () => __awaiter(this, void 0, void 0, function* () {
            const desk = yield this.connectDesk();
            yield this.bluetooth.disconnect(desk.device);
            yield this.config.delete();
        });
        this.actionConnect = () => __awaiter(this, void 0, void 0, function* () {
            yield prompts.confirmDisconnection();
            const model = yield prompts.chooseModel();
            yield prompts.confirmPairingMode();
            const devices = yield this.bluetooth.discoverDevices(model.services);
            const device = yield prompts.chooseDevice(devices);
            const bluetoothDevice = yield this.bluetooth.connect(device.address);
            yield bluetoothDevice.Pair();
            this.config.setConnectedDevice({
                name: device.name,
                address: device.address,
                modelName: model.name
            });
        });
        this.actionStatus = () => __awaiter(this, void 0, void 0, function* () {
            const { address, modelName, name } = this.config.getConnectedDevice();
            const desk = yield this.connectDesk();
            const state = yield desk.state();
            const content = treeify_1.default.asTree({
                Device: {
                    Name: name,
                    Address: address
                },
                Adapter: modelName,
                State: {
                    Centimeters: state.cm.toFixed(2),
                    Inches: state.inch.toFixed(2),
                    DeviceValue: "" + state.value,
                    DeviceSpeedValue: "" + state.speed,
                }
            }, true, true);
            console.log(`STATUS\n${content}`);
        });
        this.actionMoveUp = () => __awaiter(this, void 0, void 0, function* () {
            const desk = yield this.connectDesk();
            yield desk.up();
        });
        this.actionMoveDown = () => __awaiter(this, void 0, void 0, function* () {
            const desk = yield this.connectDesk();
            yield desk.down();
        });
        this.actionMoveTo = (position) => __awaiter(this, void 0, void 0, function* () {
            const desk = yield this.connectDesk();
            const { pos, unit } = this.parsePositionString(position);
            const initialState = yield desk.state();
            const progress = new progress_1.default(":percent [:bar] (:cmcm | :inchinches | :pctpct)", {
                // Total is the difference from current position to the desired position.
                total: Math.abs(pos - (unit === AbstractDesk_1.LENGTH_UNITS.CM ? initialState.cm : unit === AbstractDesk_1.LENGTH_UNITS.INC ? initialState.inch : initialState.pct)),
                renderThrottle: 50,
                width: 20,
                clear: true
            });
            desk.addListener(AbstractDesk_1.DESK_EVENT.STATE_CHANGE, (state) => {
                progress.curr = unit === AbstractDesk_1.LENGTH_UNITS.CM ? Math.abs(initialState.cm - state.cm) : unit === AbstractDesk_1.LENGTH_UNITS.INC ? Math.abs(initialState.inch - state.inch) : Math.abs(initialState.pct - state.pct);
                progress.render({ cm: state.cm.toFixed(0), inch: state.inch.toFixed(0), pct: state.pct.toFixed(0), speed: state.speed / 100 });
            });
            const completed = yield desk.moveTo(pos, unit);
            progress.curr = pos;
            // Render final progress state
            const finalState = yield desk.state();
            progress.render({ cm: finalState.cm.toFixed(0), inch: finalState.inch.toFixed(0), speed: finalState.speed / 100 });
            if (completed === false) {
                // if not completed possible resistance detected.
                console.log("");
                console.log("Resistance detected, stop action for safety.");
            }
            else {
                console.log("");
            }
        });
        this.preAction = () => __awaiter(this, void 0, void 0, function* () {
            this.profile = commander_1.program.profile || "default";
            this.adapter = commander_1.program.adapter || "hci0";
            if (commander_1.program.debug)
                logger_1.default.setLevel(logger_1.default.LEVEL.DEBUG);
            this.config = new config_1.ConfigManager(this.profile);
            yield this.bluetooth.init(this.adapter);
        });
        this.onActionEnd = (result) => {
            if (result)
                console.log(result);
            process.exit(0);
        };
        this.onActionError = (err) => {
            logger_1.default.warn(err);
            console.error(err.message);
            process.exit(1);
        };
        this.parsePositionString = (position) => {
            const parser = /(\d+)(\w+)?/;
            const [root = null, pos = null, unit = null] = parser.exec(position) || [];
            if (Number.isNaN(parseInt(pos))) {
                throw new Error("Invalid position input, supported format: <position: number>(cm|inch|%) - example: '70cm' OR '35inch' OR '42%'");
            }
            else if (["cm", "inch", "%"].indexOf(unit) === -1) {
                throw new Error("Invalid position unit: supported units: 'cm' OR 'inch' OR '%' - example: '70cm' OR '35inch' OR '42%'");
            }
            return {
                pos: parseInt(pos),
                unit: unit === "cm" ? AbstractDesk_1.LENGTH_UNITS.CM : unit === "inch" ? AbstractDesk_1.LENGTH_UNITS.INC : AbstractDesk_1.LENGTH_UNITS.PCT
            };
        };
        commander_1.program.version(version_json_1.version);
        commander_1.program.option('--profile <profile>', "select configuration profile", "default");
        commander_1.program.option('--adapter <adapter>', "bluetooth adapter selection", "hci0");
        commander_1.program.option('--debug', "enable more details logs", false);
        commander_1.program
            .command("connect")
            .description("connect and pair a supported device")
            .action(this.decorate(this.actionConnect));
        commander_1.program
            .command("disconnect")
            .description("disconnect and remove connected device")
            .action(this.decorate(this.actionDisconnect));
        commander_1.program
            .command("status")
            .description("get information about the current connect device")
            .action(this.decorate(this.actionStatus));
        commander_1.program
            .command("report")
            .description("start a report process for unsupported device and get all information for support")
            .action(this.decorate(this.actionReport));
        commander_1.program
            .command("up")
            .description("perform a single UP action")
            .action(this.decorate(this.actionMoveUp));
        commander_1.program
            .command("down")
            .description("perform a single DOWN action")
            .action(this.decorate(this.actionMoveDown));
        commander_1.program
            .command("to <position>")
            .description("move desk to a specific position (absolute height), supported units: centimeter/inches, example: '65cm' OR '40inch' ")
            .action(this.decorate(this.actionMoveTo));
        this.bluetooth = new bluetooth_1.default();
    }
    parse(argv) {
        commander_1.program.parse(argv);
    }
    decorate(action) {
        return (...args) => __awaiter(this, void 0, void 0, function* () {
            yield this.preAction();
            return action(...args).then(this.onActionEnd).catch(this.onActionError);
        });
    }
    connectDesk() {
        return __awaiter(this, void 0, void 0, function* () {
            const { address, modelName } = this.config.getConnectedDevice();
            const model = factory.getDeskModel(modelName);
            yield this.bluetooth.startDiscovery();
            const bluetoothDevice = yield this.bluetooth.connect(address);
            yield this.bluetooth.stopDiscovery();
            const desk = factory.createDesk(model, bluetoothDevice);
            yield desk.connect();
            yield desk.subscribe();
            return desk;
        });
    }
}
exports.CommandLine = CommandLine;
