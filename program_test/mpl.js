const {Keypair, Transaction, SystemProgram, Connection, PublicKey, sendAndConfirmTransaction} = require("@solana/web3.js");
const splToken = require("@solana/spl-token");
const mpl = require("@metaplex-foundation/mpl-token-metadata");
const {prepareAccount} = require("./wallet");

const connection = new Connection("https://api.devnet.solana.com");


async function createToken(wallet, Auth2, suppressLog=true) { // Keypair -> [Pubkey, Pubkey]
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
            0,
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
    let associatedAccount2 = await splToken.getAssociatedTokenAddress(
        mint.publicKey, // mint
        Auth2.publicKey, // owner
        false
    );
    tx.add(
        splToken.createAssociatedTokenAccountInstruction(
            Auth2.publicKey,
            associatedAccount2,
            Auth2.publicKey,
            mint.publicKey
        )
    );
    tx.add(
        splToken.createMintToInstruction(
            mint.publicKey,
            associatedAccount,
            wallet.publicKey,
            10000
        )
    );
    tx.add(
        splToken.createMintToInstruction(
            mint.publicKey,
            associatedAccount2,
            wallet.publicKey,
            10000
        )
    );
    let txId = await sendAndConfirmTransaction(connection, tx, [wallet, mint, Auth2],{
        skipPreflight: true,
        preflightCommitment: "confirmed",
        confirmation: "confirmed",
    });
    if(!suppressLog) console.log("TokenCreation:", `https://explorer.solana.com/tx/${txId}?cluster=devnet`);
    return [mint.publicKey, associatedAccount, associatedAccount2];
}

const MPL_TOKEN_METADATA_PROGRAM_ID = mpl.PROGRAM_ID;

async function getMetadataPDA(mint){
    const [publicKey] = await PublicKey.findProgramAddress(
        [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        MPL_TOKEN_METADATA_PROGRAM_ID
    );
    return publicKey;
}

async function getMasterEditionPDA(mint){
    const [publicKey] = await PublicKey.findProgramAddress(
        [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
        MPL_TOKEN_METADATA_PROGRAM_ID
    );
    return publicKey;
}

async function createMetadata(wallet, mint, collection, collectionMeta, collectionMaster,
                              suppressLog=true) { // Keypair, Pubkey -> Pubkey
    const tx = new Transaction();
    const meta = await getMetadataPDA(mint);
    const master = await getMasterEditionPDA(mint);
    tx.add(mpl.createCreateMetadataAccountV2Instruction(
        {
            metadata: meta,
            mint: mint,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
        },
        {
            createMetadataAccountArgsV2: {
                data: {
                    name: "Default NFT",
                    symbol: "D",
                    uri: "",
                    sellerFeeBasisPoints: 500,
                    creators: [
                        {
                            address: wallet.publicKey,
                            verified: true,
                            share: 100,
                        },
                    ],
                    collection: {
                        verified: false,
                        key: collection
                    },
                    uses: null
                },
                isMutable: true,
            },
        }
    ))
    tx.add(mpl.createCreateMasterEditionInstruction(
            {
                edition: master,
                mint: mint,
                updateAuthority: wallet.publicKey,
                mintAuthority: wallet.publicKey,
                payer: wallet.publicKey,
                metadata: meta,
            },
            {
                createMasterEditionArgs: {
                    maxSupply: 0,
                },
            }
    ));
    tx.add(mpl.createVerifyCollectionInstruction(
        {
            metadata: meta,
            collectionAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            collectionMint: collection,
            collection: collectionMeta,
            collectionMasterEditionAccount: collectionMaster
        }
    ))
    let txId = await sendAndConfirmTransaction(connection, tx, [wallet],{
        skipPreflight: true,
        preflightCommitment: "confirmed",
        confirmation: "confirmed",
    });
    if(!suppressLog) console.log("MetadataCreation:", txId);
    return meta;
}

async function createCollectionMetadata(wallet, mint, suppressLog=true) { // Keypair, Pubkey -> [Pubkey, Pubkey]
    const tx = new Transaction();
    const meta = await getMetadataPDA(mint);
    const master = await getMasterEditionPDA(mint);
    tx.add(mpl.createCreateMetadataAccountInstruction(
        {
            metadata: meta,
            mint: mint,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            updateAuthority: wallet.publicKey,
        },
        {
            createMetadataAccountArgs: {
                data: {
                    name: "Default Collection",
                    symbol: "",
                    uri: "",
                    sellerFeeBasisPoints: 0,
                    creators: [{
                        address: wallet.publicKey,
                        verified: true,
                        share: 100,
                    }],
                },
                isMutable: true,
            },
        }
    ))
    tx.add(mpl.createCreateMasterEditionInstruction(
        {
            edition: master,
            mint: mint,
            updateAuthority: wallet.publicKey,
            mintAuthority: wallet.publicKey,
            payer: wallet.publicKey,
            metadata: meta,
        },
        {
            createMasterEditionArgs: {
                maxSupply: 0,
            },
        }
    ));
    let txId = await sendAndConfirmTransaction(connection, tx, [wallet],{
        skipPreflight: true,
        preflightCommitment: "confirmed",
        confirmation: "confirmed",
    });
    if(!suppressLog) console.log("CollectionMetadataCreation:", txId);
    return [meta, master];
}

async function createNFT(wallet, suppressLog=true) { // Pubkey -> Pubkey[] ~ [Mint, Account, Metadata, Collection]
    const [collectionMint, _collectionAccount] = await createToken(wallet, suppressLog);
    const [collectionMeta, collectionMaster] = await createCollectionMetadata(wallet, collectionMint, suppressLog);
    const [mint, account] = await createToken(wallet, suppressLog);
    const meta = await createMetadata(wallet, mint, collectionMint, collectionMeta, collectionMaster, suppressLog);
    return [mint, account, meta, collectionMint];
}

async function createAssociatedAccount(wallet, mint) {
    let tx = new Transaction();
    let associatedAccount = await splToken.getAssociatedTokenAddress(
        mint, // mint
        wallet.publicKey, // owner
        false
    );
    tx.add(
        splToken.createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedAccount,
            wallet.publicKey,
            mint
        )
    );
    let txId = await sendAndConfirmTransaction(connection, tx, [wallet],{
        skipPreflight: true,
        preflightCommitment: "confirmed",
        confirmation: "confirmed",
    });
    console.log("Associated Account Creation:", `https://explorer.solana.com/tx/${txId}?cluster=devnet`);
    return associatedAccount;
}


module.exports = {prepareAccount, createToken, createMetadata, createNFT, createAssociatedAccount};