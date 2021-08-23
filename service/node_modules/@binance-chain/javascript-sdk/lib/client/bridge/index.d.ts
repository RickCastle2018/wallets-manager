import { BncClient } from "../";
import { TransferInClaim, TransferOutRefundClaim, UpdateBindClaim } from "../../types";
/**
 * Bridge
 */
export declare class Bridge {
    private _bncClient;
    /**
     * @param {BncClient} bncClient
     */
    constructor(bncClient: BncClient);
    /**
     * transfer smart chain token to binance chain receiver
     */
    transferIn({ sequence, contract_address, refund_addresses, receiver_addresses, amounts, relay_fee, expire_time, symbol, fromAddress, }: TransferInClaim & {
        sequence: number;
        fromAddress: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * refund tokens to sender if transfer to smart chain failed
     */
    transferOutRefund({ transfer_out_sequence, refund_address, refund_reason, amount, fromAddress, }: TransferOutRefundClaim & {
        fromAddress: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * bind smart chain token to bep2 token
     */
    bind({ contractAddress, contractDecimal, amount, symbol, expireTime, fromAddress, }: {
        contractAddress: string;
        contractDecimal: number;
        amount: number;
        symbol: string;
        expireTime: number;
        fromAddress: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * transfer token from Binance Chain to Binance Smart Chain
     */
    transferFromBcToBsc({ toAddress, amount, symbol, expireTime, fromAddress, }: {
        toAddress: string;
        amount: number;
        symbol: string;
        expireTime: number;
        fromAddress: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * update bind request when events from smart chain received
     */
    upateBind({ sequence, contract_address, symbol, status, fromAddress, }: UpdateBindClaim & {
        sequence: number;
        fromAddress: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    skipSequence({ sequence, sequenceToSkip, fromAddress, }: {
        sequence: number;
        sequenceToSkip: number;
        fromAddress: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    private buildClaimAndBroadcast;
    private broadcast;
}
