export interface IString {
    length: number;
    array: Uint8Array;
    value: string;
}
export declare class TString implements IString {
    length: number;
    array: Uint8Array;
    value: string;
    constructor(length: number, array: Uint8Array, value: string);
    static deserialize(data: Uint8Array): [TString, Uint8Array];
    static fromString(s: string): TString;
    serialize(): Uint8Array;
}
//# sourceMappingURL=string.d.ts.map