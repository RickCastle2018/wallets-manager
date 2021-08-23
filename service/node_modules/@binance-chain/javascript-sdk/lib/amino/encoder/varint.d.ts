/// <reference types="node" />
export declare const UVarInt: {
    encode: (n: number, buffer?: Buffer | any, offset?: number | undefined) => any;
    decode: (bytes: Buffer | any) => number;
    encodingLength: (n: number) => number;
};
export declare const VarInt: {
    encode: (n: number, buffer?: Buffer | any, offset?: number | undefined) => any;
    decode: (bytes: Buffer | any) => number;
    encodingLength: (n: number) => number;
};
