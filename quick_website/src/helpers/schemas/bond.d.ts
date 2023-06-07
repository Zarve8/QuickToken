import { TString } from "./string";
import { TDeserializable } from "./vector";
export interface IBond {
    name: TString;
    amount: BigInteger;
    rate: number;
    used: number;
    sold: number;
}
export declare class Bond implements IBond, TDeserializable {
    name: TString;
    amount: BigInteger;
    rate: number;
    used: number;
    sold: number;
    constructor(name: TString, amount: BigInteger, rate: number, used: number, sold: number);
    static deserialize(data: Uint8Array): [Bond, Uint8Array];
}
//# sourceMappingURL=bond.d.ts.map