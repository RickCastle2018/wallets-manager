/// <reference types="node" />
/**
 * encode number
 * @category amino
 * @param num
 */
export declare const encodeNumber: (num: number) => any;
/**
 * encode bool
 * @category amino
 * @param b
 */
export declare const encodeBool: (b: boolean) => any;
/**
 * encode string
 * @category amino
 * @param str
 */
export declare const encodeString: (str: string) => Buffer;
/**
 * encode time
 * @category amino
 * @param value
 */
export declare const encodeTime: (value: string | Date) => Buffer;
/**
 * @category amino
 * @param obj -- {object}
 * @return bytes {Buffer}
 */
export declare const convertObjectToSignBytes: (obj: any) => Buffer;
/**
 * js amino MarshalBinary
 * @category amino
 * @param {Object} obj
 *  */
export declare const marshalBinary: (obj: any) => any;
/**
 * js amino MarshalBinaryBare
 * @category amino
 * @param {Object} obj
 *  */
export declare const marshalBinaryBare: (obj: any) => any;
/**
 * This is the main entrypoint for encoding all types in binary form.
 * @category amino
 * @param {*} js data type (not null, not undefined)
 * @param {Number} field index of object
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} binary of object.
 */
export declare const encodeBinary: (val: any, fieldNum?: number | undefined, isByteLenPrefix?: boolean | undefined) => any;
/**
 * prefixed with bytes length
 * @category amino
 * @param {Buffer} bytes
 * @return {Buffer} with bytes length prefixed
 */
export declare const encodeBinaryByteArray: (bytes: Buffer) => Buffer;
/**
 * @category amino
 * @param {Object} obj
 * @return {Buffer} with bytes length prefixed
 */
export declare const encodeObjectBinary: (obj: any, isByteLenPrefix?: boolean | undefined) => Buffer;
/**
 * @category amino
 * @param {Number} fieldNum object field index
 * @param {Array} arr
 * @param {Boolean} isByteLenPrefix
 * @return {Buffer} bytes of array
 */
export declare const encodeArrayBinary: (fieldNum: number | undefined, arr: any[], isByteLenPrefix?: boolean | undefined) => Buffer;
export * from "./varint";
