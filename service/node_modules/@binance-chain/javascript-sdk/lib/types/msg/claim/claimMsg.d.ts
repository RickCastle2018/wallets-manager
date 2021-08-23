/// <reference types="node" />
import { BaseMsg, Msg, SignMsg } from "../";
import { AminoPrefix } from "../../tx";
import { ClaimTypes } from "./claimTypes";
export interface SignedClaimMsg extends SignMsg {
    claim_type: ClaimTypes;
    sequence: number;
    claim: string;
    validator_address: string;
}
export interface ClaimMsgData extends Msg {
    claim_type: ClaimTypes;
    sequence: number;
    claim: string;
    validator_address: Buffer;
    aminoPrefix: AminoPrefix;
}
export declare class ClaimMsg extends BaseMsg {
    private claim_type;
    private sequence;
    private claim;
    private validator_address;
    constructor({ claim_type, sequence, claim, validator_address, }: {
        claim_type: ClaimTypes;
        sequence: number;
        claim: string;
        validator_address: string;
    });
    getSignMsg(): SignedClaimMsg;
    getMsg(): ClaimMsgData;
    static defaultMsg(): ClaimMsgData;
}
