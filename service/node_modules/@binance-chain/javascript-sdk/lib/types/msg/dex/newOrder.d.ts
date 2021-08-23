/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
export interface NewOrder {
    id: string;
    symbol: string;
    ordertype: number;
    side: number;
    price: number;
    quantity: number;
    timeinforce: number;
}
export interface SignedNewOrder extends SignMsg, NewOrder {
    sender: string;
}
export interface NewOrderData extends Msg, NewOrder {
    sender: Buffer;
    aminoPrefix: AminoPrefix;
}
export declare class NewOrderMsg extends BaseMsg {
    private newOrder;
    private address;
    readonly aminoPrefix: AminoPrefix;
    constructor(data: NewOrder, address: string);
    getSignMsg(): SignedNewOrder;
    getMsg(): NewOrderData;
    static defaultMsg(): {
        sender: Buffer;
        id: string;
        symbol: string;
        orderType: number;
        side: number;
        price: number;
        quantity: number;
        timeinforce: number;
        aminoPrefix: AminoPrefix;
    };
}
