/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedTimeUnlockMsg extends SignMsg {
    from: string;
    time_lock_id: number;
}
export interface TimeUnlockData extends Msg {
    from: Buffer;
    time_lock_id: number;
    aminoPrefix: AminoPrefix;
}
export declare class TimeUnlockMsg extends BaseMsg {
    private from;
    private time_lock_id;
    constructor({ address, time_lock_id, }: {
        address: string;
        time_lock_id: number;
    });
    getSignMsg(): SignedTimeUnlockMsg;
    getMsg(): TimeUnlockData;
    static defaultMsg(): {
        from: Buffer;
        time_lock_id: number;
        aminoPrefix: AminoPrefix;
    };
}
