import {PublicKey, Keypair, TransactionInstruction} from "@solana/web3.js";
import * as env from "./env";
import {getAssociatedAccountAddress, getCompanyAddress, getPortfolioAddress,
    getStorageAddress, getMetadataAddress, getAssetAddress} from "./accounts";
import {TString} from "./schemas/string";
import {toLittleEndian} from "./big-byte";
import BigInteger from "big-integer";
import {Portfolio, Portfolio as TPortfolio} from "./schemas/portfolio";
import {Asset} from "./schemas/asset";
import {getAssociatedTokenAddress} from "@solana/spl-token";
import {Company} from "./schemas/company";


interface AccountInfo {
    pubkey: PublicKey;
    isSigner: boolean;
    isWritable: boolean;
}

function injectPrograms(keys: AccountInfo[], used_sys: number[]): AccountInfo[] {
    if(used_sys[0]) keys.push({
        pubkey: env.SystemProgram,
        isSigner: false,
        isWritable: false,
    });
    if(used_sys[1]) keys.push({
        pubkey: env.TokenProgram,
        isSigner: false,
        isWritable: false,
    });
    if(used_sys[2]) keys.push({
        pubkey: env.AssociatedProgram,
        isSigner: false,
        isWritable: false,
    });
    if(used_sys[3]) keys.push({
        pubkey: env.MetadataProgram,
        isSigner: false,
        isWritable: false,
    });
    if(used_sys[4]) keys.push({
        pubkey: env.Sysvar,
        isSigner: false,
        isWritable: false,
    });
    return keys;
}

function packTx(program: PublicKey, idx: Uint8Array, wallet: PublicKey, accounts: PublicKey[], used_sys: number[], signers?: Keypair[]): TransactionInstruction {
    if(!signers) signers = [];
    let keys: AccountInfo[] = [{
        pubkey: wallet,
        isSigner: true,
        isWritable: true,
    }];
    accounts.forEach(account => {
        if(signers.filter((value) => {return value.publicKey.equals(account)}).length > 0){
            keys.push({
                pubkey: account,
                isSigner: true,
                isWritable: true,
            })
        }
        else {
            keys.push({
                pubkey: account,
                isSigner: false,
                isWritable: true,
            })
        }
    });
    keys = injectPrograms(keys, used_sys);
    return new TransactionInstruction({
        keys: keys,
        programId: program,
        data: Buffer.from(idx),
    });
}

export async function createCompanyTx(owner: PublicKey, name: string, description: string): Promise<[TransactionInstruction, PublicKey]> {
    const Salt = new Keypair().publicKey;
    const Company = await getCompanyAddress(owner, Salt);
    const Treasury = await getAssociatedAccountAddress(env.USDT, owner);
    const idx = [0].concat(Array.from(TString.fromString(name).serialize())).concat(Array.from(TString.fromString(description).serialize()));
    return [packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Treasury, Salt], [1, 0, 0, 0, 0]), Company];
}

export async function createPortfolioTx(owner: PublicKey, Company: PublicKey, bondCount: number, image: number): Promise<[TransactionInstruction, PublicKey]> {
    const Portfolio = await getPortfolioAddress(owner, Company);
    const Token_Storage = await getStorageAddress(Portfolio, env.USDT); //@ts-ignore
    const idx = [1].concat(Array.from(toLittleEndian(BigInteger(bondCount.toString()), 4))).concat([image]);
    return [packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Portfolio, env.USDT, Token_Storage], [1, 1, 0, 0, 1]), Portfolio];
}

export async function insertBondTx(owner: PublicKey, Company: PublicKey, Portfolio: PublicKey, name: string, rate: string, amount: string) {
    //@ts-ignore
    const idx = [2].concat(Array.from(TString.fromString(name).serialize()))
        .concat(Array.from(toLittleEndian(BigInteger(amount), 8)))
        .concat(Array.from(toLittleEndian(BigInteger(rate), 2)));
    return packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Portfolio], [0, 0, 0, 0, 0]);
}

export async function startPortfolioTx(owner: PublicKey, Company: PublicKey, Portfolio: PublicKey, period: string) { //@ts-ignore
    const idx = [5].concat(Array.from(toLittleEndian(BigInteger(period), 8)));
    return packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Portfolio], [0, 0, 0, 0, 0]);
}

export async function mintAssetTx(owner: PublicKey, Company: PublicKey, Portfolio: PublicKey, url_id: number, mask: number[]) {
    const mint = new Keypair();
    const meta = await getMetadataAddress(mint.publicKey);
    const asset = await getAssetAddress(Portfolio, mint.publicKey);
    const storage = await getStorageAddress(Portfolio, mint.publicKey);
    const idx = [3, url_id%250].concat([mask.length, 0, 0, 0]).concat(mask);
    return [packTx(env.QuickProgram, new Uint8Array(idx), owner,
        [Company, Portfolio, mint.publicKey, asset, storage, meta], [1, 1, 0, 1, 1], [mint]), mint];
}

export async function payoutTx(owner: PublicKey, portfolio: TPortfolio, mask: number[]) {
    const Treasury = await getAssociatedAccountAddress(env.USDT, owner);
    const Token_Storage = await getStorageAddress(portfolio.publicKey, env.USDT);
    const idx = [7].concat([mask.length, 0, 0, 0]).concat(mask);
    return packTx(env.QuickProgram, new Uint8Array(idx), owner, [portfolio.company, portfolio.publicKey, Treasury, Token_Storage], [0, 1, 0, 0, 0]);
}

export async function stopSalesTx(owner: PublicKey, portfolio: TPortfolio) {
    return packTx(env.QuickProgram, new Uint8Array([6]), owner, [portfolio.company, portfolio.publicKey], [0, 0, 0, 0, 0]);
}

export async function buyAssetTx(owner: PublicKey, asset: Asset, portfolio: Portfolio, company: Company) {
    const assetVault = await getAssociatedTokenAddress(asset.mint, owner);
    const AssetStorage = await getStorageAddress(portfolio.publicKey, asset.mint);
    const USDTVault = await getAssociatedTokenAddress(env.USDT, owner);
    return packTx(env.QuickProgram, new Uint8Array([4]), owner, [portfolio.company, portfolio.publicKey,
        asset.publicKey, asset.mint, USDTVault, company.treasury, AssetStorage, assetVault], [1, 1, 1, 0, 1]);
}

export async function cashOutTx(owner: PublicKey, asset: Asset, portfolio: Portfolio, company: Company) {
    const assetVault = await getAssociatedTokenAddress(asset.mint, owner);
    const USDTVault = await getAssociatedTokenAddress(env.USDT, owner);
    return packTx(env.QuickProgram, new Uint8Array([8]), owner,
        [company.publicKey, portfolio.publicKey, env.USDT, asset.mint, asset.publicKey, assetVault, USDTVault, portfolio.token_storage],
        [1, 1, 1, 0, 1]);
}
