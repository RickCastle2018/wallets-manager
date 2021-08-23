/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedFreezeToken extends SignMsg {
    from: string;
    symbol: string;
    amount: number;
}
export interface FreezeTokenData extends Msg {
    from: Buffer;
    symbol: string;
    amount: number;
    aminoPrefix: AminoPrefix;
}
export declare class FreezeTokenMsg extends BaseMsg {
    private from;
    private symbol;
    private amount;
    constructor({ address, sybmol, amount, }: {
        address: string;
        sybmol: string;
        amount: number;
    });
    getSignMsg(): SignedFreezeToken;
    getMsg(): FreezeTokenData;
    static defaultMsg(): {
        from: Buffer;
        symbol: string;
        amount: number;
        aminoPrefix: AminoPrefix;
    };
}
