/// <reference types="node" />
import { AccountTag } from "./account_tag";
import { Connection, PublicKey } from "@solana/web3.js";
import { TVector } from "./vector";
import { Bond } from "./bond";
import { IAddressable } from "./addresable";
export declare enum PortfolioStatus {
    Created = 0,
    Started = 1,
    Sold = 2,
    Payed = 3
}
export interface IPortfolio {
    tag: AccountTag;
    company: PublicKey;
    token_storage: PublicKey;
    bump: number;
    status: PortfolioStatus;
    period: BigInteger;
    end: BigInteger;
    image: number;
    bonds: TVector<Bond>;
    payout_mask: number[];
}
export declare class Portfolio implements IPortfolio, IAddressable {
    tag: AccountTag;
    company: PublicKey;
    token_storage: PublicKey;
    bump: number;
    status: PortfolioStatus;
    period: BigInteger;
    end: BigInteger;
    image: number;
    bonds: TVector<Bond>;
    payout_mask: number[];
    publicKey: PublicKey;
    constructor(data: Uint8Array, publicKey: PublicKey);
    static download(record: PublicKey, connection: Connection): Promise<(Buffer | Portfolio)[]>;
}
//# sourceMappingURL=portfolio.d.ts.map