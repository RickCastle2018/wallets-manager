import { BigSource } from "big.js";
import { BncClient } from "..";
import { Coin } from "../../types";
export declare const validateMiniTokenSymbol: (symbol: string) => void;
/**
 * issue or view tokens
 */
declare class TokenManagement {
    private _bncClient;
    /**
     * @param {Object} bncClient
     */
    constructor(bncClient: BncClient);
    /**
     * create a new asset on Binance Chain
     * @param {String} - senderAddress
     * @param {String} - tokenName
     * @param {String} - symbol
     * @param {Number} - totalSupply
     * @param {Boolean} - mintable
     * @returns {Promise} resolves with response (success or fail)
     */
    issue(senderAddress: string, tokenName: string, symbol: string, totalSupply?: number, mintable?: boolean): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * issue a new mini-token, total supply should be less than 1M
     * @param {String} - senderAddress
     * @param {String} - tokenName
     * @param {String} - symbol
     * @param {Number} - totalSupply
     * @param {Boolean} - mintable
     * @param {string} - token_uri
     * @returns {Promise} resolves with response (success or fail)
     */
    issueMiniToken(senderAddress: string, tokenName: string, symbol: string, totalSupply?: number, mintable?: boolean, tokenUri?: string): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * issue a new tiny-token, total supply should be less than 10K
     * @param {String} - senderAddress
     * @param {String} - tokenName
     * @param {String} - symbol
     * @param {Number} - totalSupply
     * @param {Boolean} - mintable
     * @param {string} - token_uri
     * @returns {Promise} resolves with response (success or fail)
     */
    issueTinyToken(senderAddress: string, tokenName: string, symbol: string, totalSupply?: number, mintable?: boolean, tokenUri?: string): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * set token URI of mini-token
     */
    setTokenUri({ fromAddress, tokenUri, symbol, }: {
        fromAddress: string;
        tokenUri: string;
        symbol: string;
    }): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * freeze some amount of token
     * @param {String} fromAddress
     * @param {String} symbol
     * @param {String} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    freeze(fromAddress: string, symbol: string, amount: BigSource): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * unfreeze some amount of token
     * @param {String} fromAddress
     * @param {String} symbol
     * @param {String} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    unfreeze(fromAddress: string, symbol: string, amount: BigSource): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * burn some amount of token
     * @param {String} fromAddress
     * @param {String} symbol
     * @param {Number} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    burn(fromAddress: string, symbol: string, amount: BigSource): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * mint tokens for an existing token
     * @param {String} fromAddress
     * @param {String} symbol
     * @param {Number} amount
     * @returns {Promise}  resolves with response (success or fail)
     */
    mint(fromAddress: string, symbol: string, amount: BigSource): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * lock token for a while
     * @param {String} fromAddress
     * @param {String} description
     * @param {Array} amount
     * @param {Number} lockTime
     * @returns {Promise}  resolves with response (success or fail)
     */
    timeLock(fromAddress: string, description: string, amount: Coin[], lockTime: number): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * lock more token or increase locked period
     * @param {String} fromAddress
     * @param {Number} id
     * @param {String} description
     * @param {Array} amount
     * @param {Number} lockTime
     * @returns {Promise}  resolves with response (success or fail)
     */
    timeRelock(fromAddress: string, id: number, description: string, amount: Coin[], lockTime: number): Promise<{
        result: any;
        status: number;
    }>;
    /**
     * unlock locked tokens
     * @param {String} fromAddress
     * @param {Number} id
     * @returns {Promise}  resolves with response (success or fail)
     */
    timeUnlock(fromAddress: string, id: number): Promise<{
        result: any;
        status: number;
    }>;
}
export default TokenManagement;
