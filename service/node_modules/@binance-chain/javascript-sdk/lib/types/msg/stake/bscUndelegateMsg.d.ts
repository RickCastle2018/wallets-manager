/// <reference types="node" />
import { BaseMsg, Msg, SignMsg, Coin } from "..";
import { AminoPrefix } from "../../tx";
export interface SignedBscUndelegate extends SignMsg {
    delegator_addr: string;
    validator_addr: string;
    amount: Coin;
    side_chain_id: string;
}
export interface BscUndelegateData extends Msg {
    delegator_addr: Buffer;
    validator_addr: Buffer;
    amount: Coin;
    side_chain_id: string;
    aminoPrefix: AminoPrefix;
}
export declare class BscUndelegateMsg extends BaseMsg {
    private delegator_addr;
    private validator_addr;
    private amount;
    private side_chain_id;
    constructor({ delegator_addr, validator_addr, amount, side_chain_id, }: {
        delegator_addr: string;
        validator_addr: string;
        amount: Coin;
        side_chain_id: string;
    });
    getSignMsg(): {
        type: string;
        value: SignedBscUndelegate;
    };
    getMsg(): BscUndelegateData;
    static defaultMsg(): {
        delegator_addr: Buffer;
        validator_addr: Buffer;
        amount: {
            denom: string;
            amount: number;
        }[];
        side_chain_id: string;
        aminoPrefix: AminoPrefix;
    };
}
