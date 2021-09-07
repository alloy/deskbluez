import { DeskState } from "../desks/AbstractDesk";
import { AbstractMover } from "./AbstractMover";
export declare class LinakMover extends AbstractMover {
    /**
     * @unit micrometer
     *
     * This value defines the accuracy between currentPosition and move-to-position
     * which is used to finished | stop the mover.
     *
     * Example: If the current position is 1500/mu and our desired move-to position is 1550/mu (TOLERANCE=50).
     * with the FINISH_TOLERANCE=60 the mover would stop to perform and will finish the action.
     */
    static FINISH_TOLERANCE: number;
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
    static PERFORM_FREQUENCY: number;
    /**
     * @unit micrometer
     *
     * Keeps track of the last movement, it is used in combination
     * with `PERFORM_FREQUENCY`.
     */
    private previousPerformedPosition;
    /**
     * Determines if the mover process has detected an resistance.
     */
    private resistanceDetected;
    onStateChange: (state: DeskState) => Promise<void>;
    perform: () => Promise<boolean>;
    private move;
    private shouldPerformMove;
    get finished(): boolean;
    get currentMilliseconds(): number;
    get desiredPosition(): number;
}
