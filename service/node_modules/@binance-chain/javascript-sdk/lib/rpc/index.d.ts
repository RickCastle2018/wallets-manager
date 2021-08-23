/// <reference types="node" />
import { NETWORK_PREFIX_MAPPING } from "../client";
import Transaction from "../tx";
import { TokenBalance, Coin, AminoPrefix } from "../types";
import BaseRpc from "./baseRpc";
/**
 * The Binance Chain Node rpc client
 */
declare class RpcClient extends BaseRpc {
    private netWork;
    /**
     * @param {String} uriString dataseed address
     * @param {String} netWork Binance Chain network
     */
    constructor(uriString: string | undefined, netWork: keyof typeof NETWORK_PREFIX_MAPPING);
    /**
     * The RPC broadcast delegate broadcasts a transaction via RPC. This is intended for optional use as BncClient's broadcast delegate.
     * @param {Transaction} signedTx the signed transaction
     * @return {Promise}
     */
    broadcastDelegate(signedTx: Transaction): Promise<any>;
    getBech32Prefix(): "" | "tbnb" | "bnb";
    /**
     * @param {String} symbol - required
     * @returns {Object} token detail info
     */
    getTokenInfo(symbol: string): Promise<{
        owner: string;
        aminoPrefix: AminoPrefix;
        name: string;
        symbol: string;
        original_symbol: string;
        total_supply: number;
        mintable: boolean;
    }>;
    /**
     * get tokens by offset and limit
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Array} token list
     */
    listAllTokens(offset: number, limit: number): Promise<any>;
    /**
     * @param {String} address
     * @returns {Object} Account info
     */
    getAccount(address: string): Promise<{
        name: string;
        locked: Coin[];
        frozen: Coin[];
        base: {
            address: string;
            coins: Coin[];
            public_key: Buffer;
            account_number: number;
            sequence: number;
        };
    }>;
    /**
     * @param {Array} balances
     */
    getBalances(address: string): Promise<TokenBalance[]>;
    /**
     * get balance by symbol and address
     * @param {String} address
     * @param {String} symbol
     * @returns {Object}
     */
    getBalance(address: string, symbol: string): Promise<TokenBalance | undefined>;
    /**
     * @param {String} address
     * @param {String} symbol
     * @returns {Object}
     */
    getOpenOrders(address: string, symbol: string): Promise<any>;
    /**
     * @param {Number} offset
     * @param {Number} limit
     * @returns {Array}
     */
    getTradingPairs(offset: number, limit: number): Promise<any>;
    /**
     * @param {String} tradePair
     * @returns {Array}
     */
    getDepth(tradePair: string): Promise<any>;
    getTxByHash(hash: Buffer | string, prove?: boolean): Promise<any>;
    private parseTxResult;
}
export default RpcClient;
