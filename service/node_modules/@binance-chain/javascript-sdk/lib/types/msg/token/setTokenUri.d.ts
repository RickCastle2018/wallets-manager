/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedSetUri extends SignMsg {
    from: string;
    symbol: string;
    token_uri: string;
}
export interface SetUriData extends Msg {
    from: Buffer;
    symbol: string;
    token_uri: string;
    aminoPrefix: AminoPrefix;
}
export declare class SetTokenUriMsg extends BaseMsg {
    private from;
    private symbol;
    private token_uri;
    constructor({ from, symbol, token_uri }: SignedSetUri);
    getSignMsg(): SignedSetUri;
    getMsg(): SetUriData;
    static defaultMsg(): {
        from: Buffer;
        symbol: string;
        token_uri: string;
        aminoPrefix: AminoPrefix;
    };
}
