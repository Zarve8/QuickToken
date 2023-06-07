/// <reference types="node" />
import { AccountTag } from "./account_tag";
import { TString } from "./string";
import { Connection, PublicKey } from "@solana/web3.js";
import { IAddressable } from "./addresable";
export interface ICompany {
    tag: AccountTag;
    owner: PublicKey;
    treasury: PublicKey;
    name: TString;
    description: TString;
}
export declare class Company implements ICompany, IAddressable {
    tag: AccountTag;
    owner: PublicKey;
    treasury: PublicKey;
    name: TString;
    description: TString;
    publicKey: PublicKey;
    constructor(data: Uint8Array, publicKey: PublicKey);
    static download(record: PublicKey, connection: Connection): Promise<(Buffer | Company)[]>;
}
//# sourceMappingURL=company.d.ts.map