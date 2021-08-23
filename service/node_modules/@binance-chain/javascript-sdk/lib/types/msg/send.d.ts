/// <reference types="node" />
import { BigSource } from "big.js";
import { AminoPrefix } from "../tx";
import { BaseMsg, Msg, SignMsg } from "./";
export interface Coin {
    denom: string;
    amount: BigSource;
}
export interface SignInputOutput {
    address: string;
    coins: Coin[];
}
interface InputOutput {
    address: Buffer;
    coins: Coin[];
}
export interface SignedSend extends SignMsg {
    inputs: SignInputOutput[];
    outputs: SignInputOutput[];
}
export interface SendData extends Msg {
    inputs: InputOutput[];
    outputs: InputOutput[];
    aminoPrefix: AminoPrefix;
}
/**
 * @ignore
 * Only support transfers of one-to-one, one-to-many
 */
export declare class SendMsg extends BaseMsg {
    private sender;
    private outputs;
    readonly aminoPrefix: AminoPrefix;
    constructor(sender: string, outputs: SignInputOutput[]);
    calInputCoins(inputsCoins: Coin[], coins: Coin[]): void;
    getSignMsg(): SignedSend;
    getMsg(): SendData;
    static defaultMsg(): {
        inputs: {
            address: Buffer;
            coins: {
                denom: string;
                amount: number;
            }[];
        }[];
        outputs: {
            address: Buffer;
            coins: {
                denom: string;
                amount: number;
            }[];
        }[];
        aminoPrefix: AminoPrefix;
    };
}
export {};
