/// <reference types="node" />
import { BaseMsg, Msg, SignMsg, Coin } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedTimeLockMsg extends SignMsg {
    from: string;
    description: string;
    amount: Coin[];
    lock_time: number;
}
export interface TimeLockData extends Msg {
    from: Buffer;
    description: string;
    amount: Coin[];
    lock_time: number;
    aminoPrefix: AminoPrefix;
}
export declare class TimeLockMsg extends BaseMsg {
    private from;
    private description;
    private lock_time;
    private amount;
    constructor({ address, description, amount, lock_time, }: {
        address: string;
        description: string;
        amount: Coin[];
        lock_time: number;
    });
    getSignMsg(): SignedTimeLockMsg;
    getMsg(): TimeLockData;
    static defaultMsg(): {
        from: Buffer;
        description: string;
        amount: {
            denom: string;
            amount: number;
        }[];
        lock_time: number;
        aminoPrefix: AminoPrefix;
    };
}
