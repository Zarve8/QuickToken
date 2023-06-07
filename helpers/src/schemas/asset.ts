import {Connection, PublicKey} from "@solana/web3.js";
import {AccountTag} from "./account_tag";
import BN from "bn.js";
import {IAddressable} from "./addresable";


export interface IAsset {
    tag: AccountTag,
    portfolio: PublicKey,
    mint: PublicKey,
    image: number,
    participation: number[]
}

export class Asset implements IAsset, IAddressable {
    tag: AccountTag;
    portfolio: PublicKey;
    mint: PublicKey;
    image: number;
    participation: number[];
    publicKey: PublicKey
    constructor(data: Uint8Array, publicKey: PublicKey) {
        this.tag = data[0] as AccountTag;
        this.portfolio = new PublicKey(data.slice(1, 33));
        this.mint = new PublicKey(data.slice(33, 65));
        this.image = data[65]
        const length = new BN(data.slice(66, 70), "le").toNumber();
        this.participation = Array.from(data.slice(70, length + 70));
        this.publicKey = publicKey;
    }
    static async download(record: PublicKey, connection: Connection) {
        try{
            // @ts-ignore
            const data = (await connection.getAccountInfo(record)).data;
            return [new Asset(data, record), data];
        }
        catch(e){
            throw "Cannot parse Asset at:"+record.toBase58();
        }
    }
}