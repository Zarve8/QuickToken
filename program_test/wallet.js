const {Connection, Keypair} = require("@solana/web3.js");


const connection = new Connection("https://api.devnet.solana.com");


async function prepareAccount(suppressLog=true) { // () -> Keypair
    const wallet = new Keypair();
    const airdropSignature  = await connection.requestAirdrop(wallet.publicKey, 1e9);
    const _txId = await connection.confirmTransaction(airdropSignature);
    if(!suppressLog) console.log("Airdrop:", airdropSignature);
    return wallet;
}

function loadServerAccount(suppressLog=true) { // () -> Keypair
    const key =  Keypair.fromSecretKey(new Uint8Array(
        [152,54,168,169,243,67,164,14,28,235,227,30,104,229,77,57,167,75,250,203,66,68,51,131,100,29,246,240,94,79,154,126,76,144,114,118,5,10,130,222,139,154,136,225,155,236,63,59,37,190,108,127,209,77,246,71,108,57,209,7,149,42,82,162]
    ));
    if(!suppressLog) console.log("Server Key Loaded:", key.publicKey.toBase58());
    return key;
}


module.exports = {prepareAccount, loadServerAccount};