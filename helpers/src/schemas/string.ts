import {toLittleEndian} from "../big-byte";
import BN from "bn.js";
import BigInteger from "big-integer";


export interface IString {
    length: number;
    array: Uint8Array;
    value: string;
}

export class TString implements IString{
    length: number;
    array: Uint8Array;
    value: string;
    constructor(length: number, array: Uint8Array, value: string) {
        this.length = length;
        this.array = array;
        this.value = value;
    }
    static deserialize(data: Uint8Array): [TString, Uint8Array] {
        const length = new BN(data.slice(0, 4), "le").toNumber();
        const array = data.slice(4, length + 4);
        const value = String.fromCharCode(...array);
        return [new TString(length, array, value), data.slice(length + 4)];
    }
    static fromString(s: string): TString {
        const length = s.length;
        let array = Buffer.from(s, 'utf-8')
        return new TString(length, new Uint8Array(array), s);
    }
    serialize() { //@ts-ignore
        let data = Array.from(toLittleEndian(BigInteger(this.length.toString()), 4));
        data = data.concat(Array.from(this.array));
        return new Uint8Array(data);
    }
}