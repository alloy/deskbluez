"use strict";
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
exports.LinakMover = void 0;
const AbstractDesk_1 = require("../desks/AbstractDesk");
const logger_1 = __importDefault(require("../lib/logger"));
const AbstractMover_1 = require("./AbstractMover");
class LinakMover extends AbstractMover_1.AbstractMover {
    constructor() {
        super(...arguments);
        /**
         * Determines if the mover process has detected an resistance.
         */
        this.resistanceDetected = false;
        this.onStateChange = (state) => __awaiter(this, void 0, void 0, function* () {
            this.state = state;
            /**
             * Track speed direction change and mutate resistance-detection.
             */
            if (this.direction === "up" && state.speed < 0) {
                this.resistanceDetected = true;
            }
            else if (this.direction === "down" && state.speed > 0) {
                this.resistanceDetected = true;
            }
            if (this.finished || this.resistanceDetected) {
                // force stop and catch errors.. possible [In Progress Error]
                // but stop will still have an effect.
                logger_1.default.debug("MOVER: force stop", {
                    finished: this.finished,
                    resistanceDetected: this.resistanceDetected
                });
                yield this.desk.stop().catch(() => { });
            }
        });
        this.perform = () => __awaiter(this, void 0, void 0, function* () {
            if (this.finished) {
                logger_1.default.info("MOVER: finished");
                return true;
            }
            else if (this.resistanceDetected) {
                logger_1.default.warn("MOVER: resistance detected.. STOP");
                return false;
            }
            else if (this.shouldPerformMove()) {
                yield this.move();
                return this.perform();
            }
            else {
                yield this.wait(100);
                return this.perform();
            }
        });
    }
    move() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.debug("MOVER: perform move action...");
            if (this.desiredPosition > this.desk.total()) {
                throw new Error(`Desk is not capable to move over: ${this.desk.total()} steps, desired: ${this.desiredPosition}`);
            }
            else if (this.desiredPosition < 0) {
                throw new Error(`Desk is not capable to move below ZERO`);
            }
            this.previousPerformedPosition = this.state.value;
            if (this.direction === "down") {
                yield this.desk.down();
            }
            else {
                yield this.desk.up();
            }
        });
    }
    shouldPerformMove() {
        const previousPerformActionDistance = this.state.value - this.previousPerformedPosition;
        if (!this.previousPerformedPosition || Math.abs(previousPerformActionDistance) >= LinakMover.PERFORM_FREQUENCY) {
            return true;
        }
        else {
            return false;
        }
    }
    get finished() {
        let tolerance;
        if (this.direction === "up") {
            tolerance = this.desiredPosition - this.state.value;
        }
        else {
            tolerance = this.state.value - this.desiredPosition;
        }
        return tolerance <= LinakMover.FINISH_TOLERANCE;
    }
    get currentMilliseconds() {
        return (new Date()).getTime();
    }
    get desiredPosition() {
        let normalizedPosition;
        if (this.unit === AbstractDesk_1.LENGTH_UNITS.CM) {
            normalizedPosition = this.position * 100;
        }
        else if (this.unit === AbstractDesk_1.LENGTH_UNITS.INC) {
            normalizedPosition = this.position * 2.54 * 100;
        }
        else if (this.unit === AbstractDesk_1.LENGTH_UNITS.PCT) {
            normalizedPosition = ((this.desk.total() / 100) * this.position) + this.desk.offset();
        }
        if (this.absolute) {
            /**
             * @Todo use it from link desk-transcoder
             */
            normalizedPosition = normalizedPosition - this.desk.offset();
        }
        return normalizedPosition;
    }
}
exports.LinakMover = LinakMover;
/**
 * @unit micrometer
 *
 * This value defines the accuracy between currentPosition and move-to-position
 * which is used to finished | stop the mover.
 *
 * Example: If the current position is 1500/mu and our desired move-to position is 1550/mu (TOLERANCE=50).
 * with the FINISH_TOLERANCE=60 the mover would stop to perform and will finish the action.
 */
LinakMover.FINISH_TOLERANCE = 20;
/**
 * @unit micrometer
 *
 * This value determines the frequency of the movement (up/down) based on
 * distance to the previous movement.
 *
 * This depends on the distance the desk performs by a single movement. We currently use the 50%
 * of the distance and fire another command before the previous is done for a smooth movement.
 *
 * The default value is 50 which means the travel-distance of a single move-command is 100 mu / 1 cm
 */
LinakMover.PERFORM_FREQUENCY = 50;
