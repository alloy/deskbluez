import { AbstractTranscoder } from "./AbstractTranscoder";

import binary from "binary";

import { DeskState } from "../desks/AbstractDesk";

export class LinakTranscoder extends AbstractTranscoder {

    decodeState(data: ArrayBuffer | Buffer | String): DeskState {

        let unpackedData;

        if (typeof data === "string") {
            unpackedData = this.unpack(data);
        } else {
            unpackedData = data;
        }

        const { value, speed }: Partial<any> = binary.parse(unpackedData)
            .word16lu("value")
            .word16ls("speed")
            .vars;

        const absoluteHeight = value + this.desk.offset();
        const cm = absoluteHeight / 100;
        const inch = absoluteHeight / 100 / 2.54;
        const pct = value / (this.desk.total() / 100);

        return {
            value, cm, inch, pct, speed
        }
    }

    encodeDown(): number[] {
        return this.hexToBytes("4600");
    }

    encodeUp(): number[] {
        return this.hexToBytes("4700");
    }

    encodeStop(): number[] {
        return this.hexToBytes("FF00");
    }
}