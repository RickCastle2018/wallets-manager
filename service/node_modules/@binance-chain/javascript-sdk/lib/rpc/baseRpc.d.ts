/**
 * https://github.com/nomic-io/js-tendermint/blob/master/src/rpc.js
 */
/// <reference types="node" />
import { EventEmitter } from "events";
export declare type Args = {
    [k: string]: any;
};
export default class BaseRpc extends EventEmitter {
    private uri;
    call: BaseRpc["callWs"] | BaseRpc["callHttp"];
    private closed;
    private ws?;
    constructor(uriString?: string);
    connectWs(): void;
    callHttp(method: string, args?: Args): Promise<any>;
    callWs(method: string, args?: Args, listener?: (value: any) => void): Promise<unknown>;
    close(): void;
    private createCallBasedMethod;
    subscribe: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    unsubscribe: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    unsubscribeAll: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    status: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    netInfo: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    blockchain: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    genesis: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    health: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    block: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    blockResults: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    validators: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    consensusState: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    dumpConsensusState: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    broadcastTxCommit: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    broadcastTxSync: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    broadcastTxAsync: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    unconfirmedTxs: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    numUnconfirmedTxs: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    commit: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    tx: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    txSearch: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    abciQuery: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
    abciInfo: (args?: Args | undefined, listener?: Parameters<BaseRpc["call"]>[2]) => any;
}
