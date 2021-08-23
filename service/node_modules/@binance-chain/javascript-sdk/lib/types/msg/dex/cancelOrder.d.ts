/// <reference types="node" />
import { AminoPrefix } from "../../tx";
import { BaseMsg, Msg, SignMsg } from "../base";
export interface SignedCancelOrder extends SignMsg {
    sender: string;
    symbol: string;
    refid: string;
}
export interface CancelOrderData extends Msg {
    sender: Buffer;
    symbol: string;
    refid: string;
    aminoPrefix: AminoPrefix;
}
export declare class CancelOrderMsg extends BaseMsg {
    private address;
    private symbol;
    private orderId;
    readonly aminoPrefix: AminoPrefix;
    constructor(address: string, sybmol: string, orderId: string);
    getSignMsg(): SignedCancelOrder;
    getMsg(): CancelOrderData;
    static defaultMsg(): {
        sender: Buffer;
        symbol: string;
        refid: string;
        aminoPrefix: AminoPrefix;
    };
}
