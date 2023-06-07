const {Keypair, PublicKey, Connection} = require("@solana/web3.js");
const {createToken, createMetadata} = require("./mpl");


const connection = new Connection("https://api.devnet.solana.com/");
const wallet = Keypair.fromSecretKey(new Uint8Array(
    [
        217, 243, 195,  10, 255,  51, 240,  61,  67, 187,  64,
        236,  99, 202, 148, 238,  62, 200,  60, 228, 126,  97,
        231,  90, 136,  50,   6,  50, 193,  47, 143, 155, 241,
        244, 195,  44,  61, 127, 151,  10, 152, 156,  11,  16,
        180, 190, 127, 119,  40,  14, 226,  30, 155, 224,  63,
        255, 217,   8,  99,  43, 216,  22, 130, 235]));


async function createUSDT() {
    console.log(wallet.publicKey.toBase58())
    const [mint, account] = await createToken(wallet);
    const meta = await createMetadata(wallet, mint);
    console.log(mint.toBase58());
}

createUSDT()
