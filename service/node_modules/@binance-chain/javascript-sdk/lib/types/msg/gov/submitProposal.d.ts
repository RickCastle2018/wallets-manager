/// <reference types="node" />
import { BaseMsg, Msg, SignMsg, Coin } from "../";
import { AminoPrefix } from "../../tx";
declare const proposalTypeMapping: {
    readonly 4: "ListTradingPair";
    readonly 0: "Nil";
    readonly 1: "Text";
    readonly 2: "ParameterChange";
    readonly 3: "SoftwareUpgrade";
    readonly 5: "FeeChange";
    readonly 6: "CreateValidator";
    readonly 7: "RemoveValidator";
};
export interface SignedSubmitProposal extends SignMsg {
    title: string;
    description: string;
    proposal_type: string;
    proposer: string;
    initial_deposit: {
        denom: string;
        amount: string;
    }[];
    voting_period: string;
}
export interface SubmitProposalData extends Msg {
    title: string;
    description: string;
    proposal_type: keyof typeof proposalTypeMapping;
    proposer: Buffer;
    initial_deposit: Coin[];
    voting_period: number;
    aminoPrefix: AminoPrefix;
}
export declare class SubmitProposalMsg extends BaseMsg {
    private title;
    private description;
    private proposal_type;
    private address;
    private initialDeposit;
    private voting_period;
    constructor({ address, title, proposal_type, initialDeposit, voting_period, description, }: {
        title: string;
        description: string;
        proposal_type: keyof typeof proposalTypeMapping;
        address: string;
        initialDeposit: number;
        voting_period: number;
    });
    getSignMsg(): SignedSubmitProposal;
    getMsg(): SubmitProposalData;
    static defaultMsg(): {
        title: string;
        description: string;
        propsal_type: number;
        proposer: Buffer;
        inital_deposit: {
            denom: string;
            amount: number;
        }[];
        voting_period: number;
        aminoPrefix: AminoPrefix;
    };
}
export {};
