"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cashOutTx = exports.buyAssetTx = exports.stopSalesTx = exports.payoutTx = exports.mintAssetTx = exports.startPortfolioTx = exports.insertBondTx = exports.createPortfolioTx = exports.createCompanyTx = void 0;
const web3_js_1 = require("@solana/web3.js");
const env = __importStar(require("./env"));
const accounts_1 = require("./accounts");
const string_1 = require("./schemas/string");
const big_byte_1 = require("./big-byte");
const big_integer_1 = __importDefault(require("big-integer"));
const spl_token_1 = require("@solana/spl-token");
function injectPrograms(keys, used_sys) {
    if (used_sys[0])
        keys.push({
            pubkey: env.SystemProgram,
            isSigner: false,
            isWritable: false,
        });
    if (used_sys[1])
        keys.push({
            pubkey: env.TokenProgram,
            isSigner: false,
            isWritable: false,
        });
    if (used_sys[2])
        keys.push({
            pubkey: env.AssociatedProgram,
            isSigner: false,
            isWritable: false,
        });
    if (used_sys[3])
        keys.push({
            pubkey: env.MetadataProgram,
            isSigner: false,
            isWritable: false,
        });
    if (used_sys[4])
        keys.push({
            pubkey: env.Sysvar,
            isSigner: false,
            isWritable: false,
        });
    return keys;
}
function packTx(program, idx, wallet, accounts, used_sys, signers) {
    if (!signers)
        signers = [];
    let keys = [{
            pubkey: wallet,
            isSigner: true,
            isWritable: true,
        }];
    accounts.forEach(account => {
        if (signers.filter((value) => { return value.publicKey.equals(account); }).length > 0) {
            keys.push({
                pubkey: account,
                isSigner: true,
                isWritable: true,
            });
        }
        else {
            keys.push({
                pubkey: account,
                isSigner: false,
                isWritable: true,
            });
        }
    });
    keys = injectPrograms(keys, used_sys);
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: program,
        data: Buffer.from(idx),
    });
}
async function createCompanyTx(owner, name, description) {
    const Salt = new web3_js_1.Keypair().publicKey;
    const Company = await (0, accounts_1.getCompanyAddress)(owner, Salt);
    const Treasury = await (0, accounts_1.getAssociatedAccountAddress)(env.USDT, owner);
    const idx = [0].concat(Array.from(string_1.TString.fromString(name).serialize())).concat(Array.from(string_1.TString.fromString(description).serialize()));
    return [packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Treasury, Salt], [1, 0, 0, 0, 0]), Company];
}
exports.createCompanyTx = createCompanyTx;
async function createPortfolioTx(owner, Company, bondCount, image) {
    const Portfolio = await (0, accounts_1.getPortfolioAddress)(owner, Company);
    const Token_Storage = await (0, accounts_1.getStorageAddress)(Portfolio, env.USDT); //@ts-ignore
    const idx = [1].concat(Array.from((0, big_byte_1.toLittleEndian)((0, big_integer_1.default)(bondCount.toString()), 4))).concat([image]);
    return [packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Portfolio, env.USDT, Token_Storage], [1, 1, 0, 0, 1]), Portfolio];
}
exports.createPortfolioTx = createPortfolioTx;
async function insertBondTx(owner, Company, Portfolio, name, rate, amount) {
    //@ts-ignore
    const idx = [2].concat(Array.from(string_1.TString.fromString(name).serialize()))
        .concat(Array.from((0, big_byte_1.toLittleEndian)((0, big_integer_1.default)(amount), 8)))
        .concat(Array.from((0, big_byte_1.toLittleEndian)((0, big_integer_1.default)(rate), 2)));
    return packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Portfolio], [0, 0, 0, 0, 0]);
}
exports.insertBondTx = insertBondTx;
async function startPortfolioTx(owner, Company, Portfolio, period) {
    const idx = [5].concat(Array.from((0, big_byte_1.toLittleEndian)((0, big_integer_1.default)(period), 8)));
    return packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Portfolio], [0, 0, 0, 0, 0]);
}
exports.startPortfolioTx = startPortfolioTx;
async function mintAssetTx(owner, Company, Portfolio, url_id, mask) {
    const mint = new web3_js_1.Keypair();
    const meta = await (0, accounts_1.getMetadataAddress)(mint.publicKey);
    const asset = await (0, accounts_1.getAssetAddress)(Portfolio, mint.publicKey);
    const storage = await (0, accounts_1.getStorageAddress)(Portfolio, mint.publicKey);
    const idx = [3, url_id % 250].concat([mask.length, 0, 0, 0]).concat(mask);
    return [packTx(env.QuickProgram, new Uint8Array(idx), owner, [Company, Portfolio, mint.publicKey, asset, storage, meta], [1, 1, 0, 1, 1], [mint]), mint];
}
exports.mintAssetTx = mintAssetTx;
async function payoutTx(owner, portfolio, mask) {
    const Treasury = await (0, accounts_1.getAssociatedAccountAddress)(env.USDT, owner);
    const Token_Storage = await (0, accounts_1.getStorageAddress)(portfolio.publicKey, env.USDT);
    const idx = [7].concat([mask.length, 0, 0, 0]).concat(mask);
    return packTx(env.QuickProgram, new Uint8Array(idx), owner, [portfolio.company, portfolio.publicKey, Treasury, Token_Storage], [0, 1, 0, 0, 0]);
}
exports.payoutTx = payoutTx;
async function stopSalesTx(owner, portfolio) {
    return packTx(env.QuickProgram, new Uint8Array([6]), owner, [portfolio.company, portfolio.publicKey], [0, 0, 0, 0, 0]);
}
exports.stopSalesTx = stopSalesTx;
async function buyAssetTx(owner, asset, portfolio, company) {
    const assetVault = await (0, spl_token_1.getAssociatedTokenAddress)(asset.mint, owner);
    const AssetStorage = await (0, accounts_1.getStorageAddress)(portfolio.publicKey, asset.mint);
    const USDTVault = await (0, spl_token_1.getAssociatedTokenAddress)(env.USDT, owner);
    return packTx(env.QuickProgram, new Uint8Array([4]), owner, [portfolio.company, portfolio.publicKey,
        asset.publicKey, asset.mint, USDTVault, company.treasury, AssetStorage, assetVault], [1, 1, 1, 0, 1]);
}
exports.buyAssetTx = buyAssetTx;
async function cashOutTx(owner, asset, portfolio, company) {
    const assetVault = await (0, spl_token_1.getAssociatedTokenAddress)(asset.mint, owner);
    const USDTVault = await (0, spl_token_1.getAssociatedTokenAddress)(env.USDT, owner);
    return packTx(env.QuickProgram, new Uint8Array([8]), owner, [company.publicKey, portfolio.publicKey, env.USDT, asset.mint, asset.publicKey, assetVault, USDTVault, portfolio.token_storage], [1, 1, 1, 0, 1]);
}
exports.cashOutTx = cashOutTx;
//# sourceMappingURL=tx.js.map