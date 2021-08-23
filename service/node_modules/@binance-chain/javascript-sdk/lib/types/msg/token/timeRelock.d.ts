/// <reference types="node" />
import { BaseMsg, Msg, SignMsg, Coin } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedTimeReLockMsg extends SignMsg {
    from: string;
    time_lock_id: number;
    description: string;
    amount: Coin[];
    lock_time: number;
}
export interface TimeReLockData extends Msg {
    from: Buffer;
    time_lock_id: number;
    description: string;
    amount: Coin[];
    lock_time: number;
    aminoPrefix: AminoPrefix;
}
export declare class TimeReLockMsg extends BaseMsg {
    private from;
    private time_lock_id;
    private description;
    private lock_time;
    private amount;
    constructor({ address, time_lock_id, description, amount, lock_time, }: {
        address: string;
        time_lock_id: number;
        description: string;
        amount: Coin[];
        lock_time: number;
    });
    getSignMsg(): SignedTimeReLockMsg;
    getMsg(): TimeReLockData;
    static defaultMsg(): {
        from: Buffer;
        description: string;
        amount: number;
        lock_time: number;
        aminoPrefix: AminoPrefix;
    };
}
