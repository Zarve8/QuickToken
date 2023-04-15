const {Transaction, sendAndConfirmTransaction, PublicKey,
    Connection, TransactionInstruction} = require("@solana/web3.js");


const SystemProgram = new PublicKey("11111111111111111111111111111111");
const TokenProgram = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const AssociatedProgram = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");
const MetadataProgram = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const Sysvar = new PublicKey("SysvarRent111111111111111111111111111111111");


async function run(program, idx, wallet, accounts, used_sys, afterAccounts=[], signers = []) { // PublicKey, Keypair, PublicKey[], [bool, bool, bool, bool, bool] -> bool
    const connection = new Connection("https://api.devnet.solana.com/");
    let tx = new Transaction();
    signers = [wallet].concat(signers);
    let keys = [{
        pubkey: wallet.publicKey,
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
    if(used_sys[0]) keys.push({
        pubkey: SystemProgram,
        isSigner: false,
        isWritable: false,
    });
    if(used_sys[1]) keys.push({
        pubkey: TokenProgram,
        isSigner: false,
        isWritable: false,
    });
    if(used_sys[2]) keys.push({
        pubkey: AssociatedProgram,
        isSigner: false,
        isWritable: false,
    });
    if(used_sys[3]) keys.push({
        pubkey: MetadataProgram,
        isSigner: false,
        isWritable: false,
    });
    if(used_sys[4]) keys.push({
        pubkey: Sysvar,
        isSigner: false,
        isWritable: false,
    });
    afterAccounts.forEach(account => {
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
    let incrIx = new TransactionInstruction({
        keys: keys,
        programId: program,
        data: Buffer.from(new Uint8Array(idx)),
    });
    tx.add(incrIx);
    try {
        let txid = await sendAndConfirmTransaction(connection, tx, signers,{
            skipPreflight: false,
            preflightCommitment: "confirmed",
            confirmation: "confirmed",
        });
        console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet`);
        return true;
    }
    catch (e) {
        console.log(e);
    }
}


module.exports = {run};