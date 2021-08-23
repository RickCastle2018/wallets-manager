/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedIssueMiniTokenMsg extends SignMsg {
    name: string;
    symbol: string;
    total_supply: number;
    mintable: boolean;
    from: string;
    token_uri: string | undefined;
}
export interface IssueMiniTokenData extends Msg {
    name: string;
    symbol: string;
    total_supply: number;
    mintable: boolean;
    from: Buffer;
    token_uri: string | undefined;
    aminoPrefix: AminoPrefix;
}
export declare class IssueMiniTokenMsg extends BaseMsg {
    private params;
    constructor(params: SignedIssueMiniTokenMsg);
    getSignMsg(): SignedIssueMiniTokenMsg;
    getMsg(): IssueMiniTokenData;
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
