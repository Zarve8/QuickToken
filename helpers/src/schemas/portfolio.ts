import {AccountTag} from "./account_tag";
import {Connection, PublicKey} from "@solana/web3.js";
import {deserializeCarrier, TVector} from "./vector";
import {Bond} from "./bond";
import {fromLittleEndian} from "../big-byte";
import BN from "bn.js";
import {IAddressable} from "./addresable";


export enum PortfolioStatus {
    Created,
    Started,
    Sold,
    Payed
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


export class Portfolio implements IPortfolio, IAddressable {
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
    constructor(data: Uint8Array, publicKey: PublicKey) {
        this.tag = data[0] as AccountTag;
        this.company = new PublicKey(data.slice(1, 33));
        this.token_storage = new PublicKey(data.slice(33, 65));
        this.bump = data[65];
        this.status = data[66] as PortfolioStatus;
        //@ts-ignore
        this.period = fromLittleEndian(data.slice(67, 75));
        //@ts-ignore
        this.end = fromLittleEndian(data.slice(75, 83));
        this.image = data[83];
        [this.bonds, data] = TVector.deserialize<Bond>(deserializeCarrier<Bond>(Bond.deserialize), data.slice(84));
        const length = new BN(data.slice(0, 4), "le").toNumber();
        this.payout_mask = Array.from(data.slice(4, length + 4));
        this.publicKey = publicKey;
    }
    static async download(record: PublicKey, connection: Connection) {
        try{
            // @ts-ignore
            const data = (await connection.getAccountInfo(record)).data;
            return [new Portfolio(data, record), data];
        }
        catch(e){
            throw "Cannot parse Portfolio at:"+record.toBase58();
        }
    }
}