/// <reference types="node" />
import { AminoPrefix } from "../../tx";
import { BaseMsg, Msg, SignMsg } from "../base";
export interface SignedListMini extends SignMsg {
    from: string;
    base_asset_symbol: string;
    quote_asset_symbol: string;
    init_price: number;
}
export interface ListMiniData extends Msg {
    from: Buffer;
    base_asset_symbol: string;
    quote_asset_symbol: string;
    init_price: number;
    aminoPrefix: AminoPrefix;
}
export declare class ListMiniMsg extends BaseMsg {
    private from;
    private base_asset_symbol;
    private quote_asset_symbol;
    private init_price;
    constructor({ from, base_asset_symbol, quote_asset_symbol, init_price, }: SignedListMini);
    getSignMsg(): SignedListMini;
    getMsg(): ListMiniData;
    static defaultMsg(): {
        from: Buffer;
        base_asset_symbol: string;
        quote_asset_symbol: string;
        init_price: number;
        aminoPrefix: AminoPrefix;
    };
}
