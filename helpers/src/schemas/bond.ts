import {TString} from "./string";
import {TDeserializable} from "./vector";
import BigInteger from "big-integer";
import {fromLittleEndian} from "../big-byte";
import BN from "bn.js";


export interface IBond {
    name: TString,
    amount: BigInteger,
    rate: number,
    used: number,
    sold: number
}

export class Bond implements IBond, TDeserializable {
    name: TString;
    amount: BigInteger;
    rate: number;
    used: number;
    sold: number;
    constructor(name: TString, amount: BigInteger, rate: number, used: number, sold: number) {
        this.name = name;
        this.amount = amount;
        this.rate = rate;
        this.used = used;
        this.sold = sold;
    }
    static deserialize(data: Uint8Array): [Bond, Uint8Array] {
        let name;
        [name, data] = TString.deserialize(data);
        const amount = fromLittleEndian(data.slice(0, 8));
        const rate = new BN(data.slice(8, 10), "le").toNumber();
        const used = new BN(data.slice(10, 12), "le").toNumber();
        const sold = new BN(data.slice(12, 14), "le").toNumber();
        return [new Bond(name, amount, rate, used, sold), data.slice(14)];
    }
}
