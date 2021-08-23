/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedMintTokenMsg extends SignMsg {
    from: string;
    symbol: string;
    amount: number;
}
export interface MintTokenData extends Msg {
    from: Buffer;
    symbol: string;
    amount: number;
    aminoPrefix: AminoPrefix;
}
export declare class MintTokenMsg extends BaseMsg {
    private from;
    private symbol;
    private amount;
    constructor({ address, sybmol, amount, }: {
        address: string;
        sybmol: string;
        amount: number;
    });
    getSignMsg(): SignedMintTokenMsg;
    getMsg(): MintTokenData;
    static defaultMsg(): {
        from: Buffer;
        symbol: string;
        amount: number;
        aminoPrefix: AminoPrefix;
    };
}
