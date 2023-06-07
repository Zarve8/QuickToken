const {Keypair, Transaction, SystemProgram, Connection, PublicKey, sendAndConfirmTransaction} = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const mpl = require("@metaplex-foundation/mpl-token-metadata");


const connection = new Connection("https://api.devnet.solana.com");


async function createToken(wallet) { // Keypair -> [Pubkey, Pubkey]
    const mint = new Keypair();
    let tx = new Transaction();
    tx.add(
        SystemProgram.createAccount({
            fromPubkey: wallet.publicKey,
            newAccountPubkey: mint.publicKey,
            space: splToken.MINT_SIZE,
            lamports: await splToken.getMinimumBalanceForRentExemptMint(connection),
            programId: splToken.TOKEN_PROGRAM_ID,
        }),
        splToken.createInitializeMintInstruction(
            mint.publicKey,
            6,
            wallet.publicKey,
            wallet.publicKey,
        )
    );
    let associatedAccount = await splToken.getAssociatedTokenAddress(
        mint.publicKey, // mint
        wallet.publicKey, // owner
        false
    );
    tx.add(
        splToken.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedAccount,
            wallet.publicKey,
            mint.publicKey
        )
    );
    tx.add(
        splToken.createMintToInstruction(
            mint.publicKey,
            associatedAccount,
            wallet.publicKey,
            1000000000000
        )
    );
    try{
        let txId = await sendAndConfirmTransaction(connection, tx, [wallet, mint],{
            skipPreflight: false,
            preflightCommitment: "confirmed",
            confirmation: "confirmed",
        });
        console.log("TokenCreation:", `https://explorer.solana.com/tx/${txId}?cluster=devnet`);
        return [mint.publicKey, associatedAccount];
    }
    catch(e){
        console.log(e)
    }
}

const MPL_TOKEN_METADATA_PROGRAM_ID = mpl.PROGRAM_ID;

async function getMetadataPDA(mint){
    const [publicKey] = await PublicKey.findProgramAddress(
        [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        MPL_TOKEN_METADATA_PROGRAM_ID
    );
    return publicKey;
}


async function createMetadata(wallet, mint) { // Keypair, Pubkey -> Pubkey
    const tx = new Transaction();
    const meta = await getMetadataPDA(mint);
    console.log(meta)
    tx.add(mpl.createCreateMetadataAccountV3Instruction(
        {
            metadata: meta,
            mint: mint,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
        },
        {
            createMetadataAccountArgsV3: {
                data: {
                    name: "Quick USD",
                    symbol: "USDT",
                    uri: "https://raw.githubusercontent.com/Zarve8/Metadata/main/USDT.json",
                    sellerFeeBasisPoints: 500,
                    creators: [
                        {
                            address: wallet.publicKey,
                            verified: true,
                            share: 100,
                        },
                    ],
                    collection: null,
                    uses: null
                },
                isMutable: true,
                collectionDetails: null,
            },
        }
    ))
    console.log(tx)
    let txId = await sendAndConfirmTransaction(connection, tx, [wallet],{
        skipPreflight: false,
        preflightCommitment: "confirmed",
        confirmation: "confirmed",
    });
    console.log("MetadataCreation:", txId);
    return meta;
}


module.exports = {createToken, createMetadata};