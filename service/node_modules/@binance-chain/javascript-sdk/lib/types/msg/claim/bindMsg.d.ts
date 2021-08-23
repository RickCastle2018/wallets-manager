/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface SignedBindMsg extends SignMsg {
    from: string;
    symbol: string;
    amount: number;
    contract_address: string;
    contract_decimals: number;
    expire_time: number;
}
export interface BindMsgData extends Msg {
    from: Buffer;
    symbol: string;
    amount: number;
    contract_address: Buffer;
    contract_decimals: number;
    expire_time: number;
    aminoPrefix: AminoPrefix;
}
export declare class BindMsg extends BaseMsg {
    private from;
    private symbol;
    private amount;
    private contract_address;
    private contract_decimals;
    private expire_time;
    constructor({ from, symbol, amount, contract_address, contract_decimals, expire_time, }: {
        from: string;
        symbol: string;
        amount: number;
        contract_address: string;
        contract_decimals: number;
        expire_time: number;
    });
    getSignMsg(): SignedBindMsg;
    getMsg(): BindMsgData;
    static defaultMsg(): BindMsgData;
}
