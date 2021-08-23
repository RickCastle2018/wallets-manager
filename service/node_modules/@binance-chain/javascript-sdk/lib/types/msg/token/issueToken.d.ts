/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface IssueParams {
    name: string;
    symbol: string;
    total_supply: number;
    mintable: boolean;
}
export interface SignedIssueTokenMsg extends SignMsg, IssueParams {
    from: string;
}
export interface IssueTokenData extends Msg, IssueParams {
    from: Buffer;
    aminoPrefix: AminoPrefix;
}
export declare class IssueTokenMsg extends BaseMsg {
    private from;
    private params;
    constructor(params: IssueParams, address: string);
    getSignMsg(): SignedIssueTokenMsg;
    getMsg(): IssueTokenData;
    static defaultMsg(): {
        from: typeof Buffer.from;
        name: string;
        symbol: string;
        total_supply: number;
        mintable: boolean;
        aminoPrefix: AminoPrefix;
    };
}
