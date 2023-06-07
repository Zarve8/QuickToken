import {PublicKey} from "@solana/web3.js";
import * as env from "./env";
import * as  splToken from "@solana/spl-token";


export async function getCompanyAddress(auth: PublicKey, salt: PublicKey) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('company'),
            env.QuickProgram.toBuffer(),
            auth.toBuffer(),
            salt.toBuffer()
        ],
        env.QuickProgram
    );
    return a[0];
}

export async function getPortfolioAddress(auth: PublicKey, company: PublicKey) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('portfolio'),
            env.QuickProgram.toBuffer(),
            auth.toBuffer(),
            company.toBuffer()
        ],
        env.QuickProgram
    );
    return a[0];
}

export async function getStorageAddress(portfolio: PublicKey, mint: PublicKey) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('vault'),
            env.QuickProgram.toBuffer(),
            portfolio.toBuffer(),
            mint.toBuffer()
        ],
        env.QuickProgram
    );
    return a[0];
}

export async function getAssetAddress(portfolio: PublicKey, mint: PublicKey) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('asset'),
            env.QuickProgram.toBuffer(),
            portfolio.toBuffer(),
            mint.toBuffer()
        ],
        env.QuickProgram
    );
    return a[0];
}

export async function getMetadataAddress(mint: PublicKey){
    const [publicKey] = await PublicKey.findProgramAddress(
        [Buffer.from("metadata"), env.MetadataProgram.toBuffer(), mint.toBuffer()],
        env.MetadataProgram
    );
    return publicKey;
}

export async function getAssociatedAccountAddress(mint: PublicKey, owner: PublicKey) {
    return await splToken.getAssociatedTokenAddress(
        mint,
        owner,
        false
    );
}