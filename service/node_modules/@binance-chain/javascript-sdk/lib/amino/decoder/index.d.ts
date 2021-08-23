/// <reference types="node" />
/**
 * @category amino
 * js amino UnmarshalBinaryLengthPrefixed
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */
export declare const unMarshalBinaryLengthPrefixed: (bytes: Buffer, type: any) => any;
/**
 * @category amino
 * js amino UnmarshalBinaryBare
 * @param {Buffer} bytes
 * @param {Object} type
 * @returns {Object}
 *  */
export declare const unMarshalBinaryBare: (bytes: Buffer, type: any) => any;
export declare const decodeFieldNumberAndTyp3: (bytes: Buffer) => any;
