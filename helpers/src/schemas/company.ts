import {AccountTag} from "./account_tag";
import {TString} from "./string";
import {Connection, PublicKey} from "@solana/web3.js";
import {IAddressable} from "./addresable";


export interface ICompany {
    tag: AccountTag,
    owner: PublicKey,
    treasury: PublicKey,
    name: TString,
    description: TString
}


export class Company implements ICompany, IAddressable {
    tag: AccountTag;
    owner: PublicKey;
    treasury: PublicKey;
    name: TString;
    description: TString;
    publicKey: PublicKey;
    constructor(data: Uint8Array, publicKey: PublicKey) {
        this.tag = data[0] as AccountTag;
        this.owner = new PublicKey(data.slice(1, 33));
        this.treasury = new PublicKey(data.slice(33, 65));
        [this.name, data] = TString.deserialize(data.slice(65));
        [this.description, data] = TString.deserialize(data);
        this.publicKey = publicKey;
    }
    static async download(record: PublicKey, connection: Connection) {
        try{
            // @ts-ignore
            const data = (await connection.getAccountInfo(record)).data;
            return [new Company(data, record), data];
        }
        catch(e){
            throw "Cannot parse Company at:"+record.toBase58();
        }
    }
}

