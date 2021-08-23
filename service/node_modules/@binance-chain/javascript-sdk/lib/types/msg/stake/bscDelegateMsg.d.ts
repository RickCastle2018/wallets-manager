/// <reference types="node" />
import { BaseMsg, Msg, SignMsg, Coin } from "..";
import { AminoPrefix } from "../../tx";
export interface SignedBscDelegate extends SignMsg {
    delegator_addr: string;
    validator_addr: string;
    delegation: Coin;
    side_chain_id: string;
}
export interface BscDelegateData extends Msg {
    delegator_addr: Buffer;
    validator_addr: Buffer;
    delegation: Coin;
    side_chain_id: string;
    aminoPrefix: AminoPrefix;
}
export declare class BscDelegateMsg extends BaseMsg {
    private delegator_addr;
    private validator_addr;
    private delegation;
    private side_chain_id;
    constructor({ delegator_addr, validator_addr, delegation, side_chain_id, }: {
        delegator_addr: string;
        validator_addr: string;
        delegation: Coin;
        side_chain_id: string;
    });
    getSignMsg(): {
        type: string;
        value: SignedBscDelegate;
    };
    getMsg(): BscDelegateData;
    static defaultMsg(): {
        delegator_addr: Buffer;
        validator_addr: Buffer;
        delegation: {
            denom: string;
            amount: number;
        }[];
        side_chain_id: string;
        aminoPrefix: AminoPrefix;
    };
}
