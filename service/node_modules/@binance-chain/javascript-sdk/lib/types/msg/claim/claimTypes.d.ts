import { Coin } from "..";
export declare enum ClaimTypes {
    ClaimTypeSkipSequence = 1,
    ClaimTypeUpdateBind = 2,
    ClaimTypeTransferOutRefund = 3,
    ClaimTypeTransferIn = 4
}
export declare enum RefundReason {
    UnboundToken = 1,
    Timeout = 2,
    InsufficientBalance = 3,
    Unkown = 4
}
export declare enum BindStatus {
    BindStatusSuccess = 0,
    BindStatusRejected = 1,
    BindStatusTimeout = 2,
    BindStatusInvalidParameter = 3
}
export interface TransferInClaim {
    contract_address: string;
    refund_addresses: string[];
    receiver_addresses: string[];
    amounts: number[];
    symbol: string;
    relay_fee: Coin;
    expire_time: number;
}
export interface TransferOutRefundClaim {
    transfer_out_sequence: number;
    refund_address: string;
    amount: Coin;
    refund_reason: RefundReason;
}
export interface UpdateBindClaim {
    status: BindStatus;
    symbol: string;
    contract_address: string;
}
export interface SkipSequenceClaim {
    claim_type: ClaimTypes;
    sequenceToSkip: number;
}
