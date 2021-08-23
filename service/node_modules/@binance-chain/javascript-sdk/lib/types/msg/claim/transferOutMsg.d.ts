/// <reference types="node" />
import { BaseMsg, Msg, SignMsg, Coin } from "..";
import { AminoPrefix } from "../../tx";
export interface SignedTransferOutMsg extends SignMsg {
    from: string;
    to: string;
    amount: Coin;
    expire_time: number;
}
export interface TransferoutData extends Msg {
    from: Buffer;
    to: Buffer;
    amount: Coin;
    expire_time: number;
    aminoPrefix: AminoPrefix;
}
export declare class TransferOutMsg extends BaseMsg {
    private from;
    private to;
    private amount;
    private expire_time;
    constructor({ from, to, amount, expire_time, }: {
        from: string;
        to: string;
        amount: Coin;
        expire_time: number;
    });
    getSignMsg(): SignedTransferOutMsg;
    getMsg(): TransferoutData;
    static defaultMsg(): TransferoutData;
}
