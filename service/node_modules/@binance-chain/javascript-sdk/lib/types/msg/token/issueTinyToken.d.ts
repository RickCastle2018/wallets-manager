/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedIssueTinyTokenMsg extends SignMsg {
    name: string;
    symbol: string;
    total_supply: number;
    mintable: boolean;
    from: string;
    token_uri: string | undefined;
}
export interface IssueTinyTokenData extends Msg {
    name: string;
    symbol: string;
    total_supply: number;
    mintable: boolean;
    from: Buffer;
    token_uri: string | undefined;
    aminoPrefix: AminoPrefix;
}
export declare class IssueTinyTokenMsg extends BaseMsg {
    private params;
    constructor(params: SignedIssueTinyTokenMsg);
    getSignMsg(): SignedIssueTinyTokenMsg;
    getMsg(): IssueTinyTokenData;
    static defaultMsg(): {
        from: typeof Buffer.from;
        name: string;
        symbol: string;
        total_supply: number;
        mintable: boolean;
        token_uri: string;
        aminoPrefix: AminoPrefix;
    };
}
