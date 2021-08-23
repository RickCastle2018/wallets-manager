import { BigSource } from "big.js";
import { NewOrderMsg, CancelOrderMsg, SendMsg, BaseMsg, BurnTokenMsg, IssueTokenMsg, FreezeTokenMsg, UnFreezeTokenMsg, TimeLockMsg, TimeUnlockMsg, MintTokenMsg, TimeReLockMsg } from "../types";
export declare const BASENUMBER: number;
export declare const divide: (num: BigSource) => number;
export declare const convertObjectArrayNum: <T extends {
    [k: string]: BigSource;
}>(objArr: T[], keys: (keyof T)[]) => void;
export declare const getMsgByAminoPrefix: (aminoPrefix: string) => typeof BaseMsg | typeof CancelOrderMsg | typeof NewOrderMsg | typeof BurnTokenMsg | typeof FreezeTokenMsg | typeof UnFreezeTokenMsg | typeof IssueTokenMsg | typeof MintTokenMsg | typeof TimeLockMsg | typeof TimeReLockMsg | typeof TimeUnlockMsg | typeof SendMsg;
