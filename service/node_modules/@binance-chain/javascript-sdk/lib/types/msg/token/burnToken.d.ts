/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedBurnToken extends SignMsg {
    from: string;
    symbol: string;
    amount: number;
}
export interface BurnTokenData extends Msg {
    from: Buffer;
    symbol: string;
    amount: number;
    aminoPrefix: AminoPrefix;
}
export declare class BurnTokenMsg extends BaseMsg {
    private from;
    private symbol;
    private amount;
    constructor({ address, sybmol, amount, }: {
        address: string;
        sybmol: string;
        amount: number;
    });
    getSignMsg(): SignedBurnToken;
    getMsg(): BurnTokenData;
    static defaultMsg(): {
        from: Buffer;
        symbol: string;
        amount: number;
        aminoPrefix: AminoPrefix;
    };
}
