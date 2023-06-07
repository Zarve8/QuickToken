/// <reference types="node" />
import { Connection, PublicKey } from "@solana/web3.js";
import { AccountTag } from "./account_tag";
import { IAddressable } from "./addresable";
export interface IAsset {
    tag: AccountTag;
    portfolio: PublicKey;
    mint: PublicKey;
    image: number;
    participation: number[];
}
export declare class Asset implements IAsset, IAddressable {
    tag: AccountTag;
    portfolio: PublicKey;
    mint: PublicKey;
    image: number;
    participation: number[];
    publicKey: PublicKey;
    constructor(data: Uint8Array, publicKey: PublicKey);
    static download(record: PublicKey, connection: Connection): Promise<(Buffer | Asset)[]>;
}
//# sourceMappingURL=asset.d.ts.map