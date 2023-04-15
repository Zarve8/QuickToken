const {PublicKey, Keypair} = require("@solana/web3.js");
const {loadServerAccount, prepareAccount} = require("./wallet");
const {run} = require("./program");
const {getCompanyAddress, getPortfolioAddress, getStorageAddress, getAssetAddress} = require("./accounts");
const {createToken, createAssociatedAccount} = require("./mpl");
const {getAssociatedTokenAddress} = require("@solana/spl-token");
const mpl = require("@metaplex-foundation/mpl-token-metadata");

const QuickProgram = new PublicKey("95mR1vSzKaW2wTLJdXd1BG5zM4AZeGBpwdcP8jzAro75");
let Auth, Auth2, USDT_Mint, Treasury, Vault2, Company, Portfolio, Token_Storage;
let Assets = [];
let Asset_Mints = [];
let Asset_Storages = [];
let Asset_Vaults = [];


async function prepare() {
    Auth = loadServerAccount();
    Auth2 = await prepareAccount();
    [USDT_Mint, Treasury, Vault2] = await createToken(Auth, Auth2, false);
}

async function createCompany() {
    const Salt = new Keypair().publicKey;
    Company = await getCompanyAddress(Auth.publicKey, Salt, QuickProgram);
    await run(QuickProgram, [0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 2], Auth, [Company, Treasury, Salt], [1, 0, 0, 0, 0]);
}

async function createPortfolio() {
    Portfolio = await getPortfolioAddress(Auth.publicKey, Company, QuickProgram);
    Token_Storage = await getStorageAddress(Portfolio, USDT_Mint, QuickProgram);
    await run(QuickProgram, [1, 5, 0, 0, 0], Auth, [Company, Portfolio, USDT_Mint, Token_Storage], [1, 1, 0, 0, 1]);
}

async function insertBond(name, amount, rate) {
    await run(QuickProgram, [2].concat(name).concat(amount).concat(rate), Auth, [Company, Portfolio], [0, 0, 0, 0, 0]);
}

const MPL_TOKEN_METADATA_PROGRAM_ID = mpl.PROGRAM_ID;

async function getMetadataPDA(mint){
    const [publicKey] = await PublicKey.findProgramAddress(
        [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
        MPL_TOKEN_METADATA_PROGRAM_ID
    );
    return publicKey;
}

async function mintAsset(mask) {
    const mint = new Keypair();
    const meta = await getMetadataPDA(mint.publicKey);
    const asset = await getAssetAddress(Portfolio, mint.publicKey, QuickProgram);
    const storage = await getStorageAddress(Portfolio, mint.publicKey, QuickProgram);
    await run(QuickProgram, [3, 1, mask.length, 0, 0, 0].concat(mask), Auth, [Company, Portfolio, mint.publicKey, asset, storage, meta], [1, 1, 0, 1, 1], [], [mint]);
    Asset_Mints.push(mint.publicKey);
    Asset_Storages.push(storage);
    Assets.push(asset);
}

async function start() {
    await run(QuickProgram, [5, 0, 0, 0, 0, 0, 0, 0, 0], Auth, [Company, Portfolio], [0, 0, 0, 0, 0]);
}

async function buyAsset(i) {
    //const assetVault = await createAssociatedAccount(Auth2, Asset_Mints[i]);
    const assetVault = await getAssociatedTokenAddress(Asset_Mints[i], Auth2.publicKey);
    await run(QuickProgram, [4], Auth2, [Company, Portfolio, Assets[i], Asset_Mints[i], Vault2, Treasury, Asset_Storages[i], assetVault], [1, 1, 1, 0, 1]);
    Asset_Vaults.push(assetVault);
}

async function stopSales() {
    await run(QuickProgram, [6], Auth, [Company, Portfolio], [0, 0, 0, 0, 0]);
}

async function payout(mask) {
    await run(QuickProgram, [7, mask.length, 0, 0, 0].concat(mask), Auth, [Company, Portfolio, Treasury, Token_Storage], [0, 1, 0, 0, 0]);
}

async function collectPayment(mintId) {
    await run(QuickProgram, [8], Auth2, [Portfolio, USDT_Mint, Asset_Mints[mintId], Assets[mintId], Asset_Vaults[mintId], Vault2, Token_Storage], [1, 1, 1, 0, 1]);
}

async function pipeline(){
    await prepare();
    await createCompany();
    await createPortfolio();
    await insertBond([1, 0, 0, 0, 1], [100, 0, 0, 0, 0, 0, 0, 0], [100, 0]);
    await insertBond([1, 0, 0, 0, 2], [200, 0, 0, 0, 0, 0, 0, 0], [100, 0]);
    await insertBond([1, 0, 0, 0, 3], [50, 0, 0, 0, 0, 0, 0, 0], [50, 0]);
    await mintAsset([0, 1, 2]);
    await mintAsset([2]);
    await mintAsset([1, 2]);
    await start();
    await buyAsset(0);
    await buyAsset(1);
    await stopSales();
    await payout([1, 0, 1]);
    await collectPayment(0);
    await collectPayment(1);
}

pipeline();