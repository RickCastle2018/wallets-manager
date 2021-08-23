/// <reference types="node" />
import { BaseMsg, Msg, SignMsg, Coin } from "..";
import { AminoPrefix } from "../../tx";
export interface SignedBscReDelegate extends SignMsg {
    delegator_addr: string;
    validator_src_addr: string;
    validator_dst_addr: string;
    amount: Coin;
    side_chain_id: string;
}
export interface BscReDelegateData extends Msg {
    delegator_addr: Buffer;
    validator_src_addr: Buffer;
    validator_dst_addr: Buffer;
    amount: Coin;
    side_chain_id: string;
    aminoPrefix: AminoPrefix;
}
export declare class BscReDelegateMsg extends BaseMsg {
    private delegator_addr;
    private validator_src_addr;
    private validator_dst_addr;
    private amount;
    private side_chain_id;
    constructor({ delegator_addr, validator_src_addr, validator_dst_addr, amount, side_chain_id, }: {
        delegator_addr: string;
        validator_src_addr: string;
        validator_dst_addr: string;
        amount: Coin;
        side_chain_id: string;
    });
    getSignMsg(): {
        type: string;
        value: SignedBscReDelegate;
    };
    getMsg(): BscReDelegateData;
    static defaultMsg(): {
        delegator_addr: Buffer;
        validator_src_addr: Buffer;
        validator_dst_addr: Buffer;
        amount: {
            denom: string;
            amount: number;
        }[];
        side_chain_id: string;
        aminoPrefix: AminoPrefix;
    };
}
