import { BncClient } from "../";
/**
 * Stake
 */
export declare class Stake {
    private _bncClient;
    /**
     * @param {BncClient} bncClient
     */
    constructor(bncClient: BncClient);
    bscDelegate({ delegateAddress, validatorAddress, amount, symbol, sideChainId, }: {
        delegateAddress: string;
        validatorAddress: string;
        amount: number;
        symbol?: string;
        sideChainId?: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    bscUndelegate({ delegateAddress, validatorAddress, amount, symbol, sideChainId, }: {
        delegateAddress: string;
        validatorAddress: string;
        amount: number;
        symbol?: string;
        sideChainId?: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    bscReDelegate({ delegateAddress, validatorSrcAddress, validatorDstAddress, amount, symbol, sideChainId, }: {
        delegateAddress: string;
        validatorSrcAddress: string;
        validatorDstAddress: string;
        amount: number;
        symbol?: string;
        sideChainId?: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    private broadcast;
}
