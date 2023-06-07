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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssociatedAccountAddress = exports.getMetadataAddress = exports.getAssetAddress = exports.getStorageAddress = exports.getPortfolioAddress = exports.getCompanyAddress = void 0;
const web3_js_1 = require("@solana/web3.js");
const env = __importStar(require("./env"));
const splToken = __importStar(require("@solana/spl-token"));
async function getCompanyAddress(auth, salt) {
    const a = await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from('company'),
        env.QuickProgram.toBuffer(),
        auth.toBuffer(),
        salt.toBuffer()
    ], env.QuickProgram);
    return a[0];
}
exports.getCompanyAddress = getCompanyAddress;
async function getPortfolioAddress(auth, company) {
    const a = await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from('portfolio'),
        env.QuickProgram.toBuffer(),
        auth.toBuffer(),
        company.toBuffer()
    ], env.QuickProgram);
    return a[0];
}
exports.getPortfolioAddress = getPortfolioAddress;
async function getStorageAddress(portfolio, mint) {
    const a = await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from('vault'),
        env.QuickProgram.toBuffer(),
        portfolio.toBuffer(),
        mint.toBuffer()
    ], env.QuickProgram);
    return a[0];
}
exports.getStorageAddress = getStorageAddress;
async function getAssetAddress(portfolio, mint) {
    const a = await web3_js_1.PublicKey.findProgramAddress([
        Buffer.from('asset'),
        env.QuickProgram.toBuffer(),
        portfolio.toBuffer(),
        mint.toBuffer()
    ], env.QuickProgram);
    return a[0];
}
exports.getAssetAddress = getAssetAddress;
async function getMetadataAddress(mint) {
    const [publicKey] = await web3_js_1.PublicKey.findProgramAddress([Buffer.from("metadata"), env.MetadataProgram.toBuffer(), mint.toBuffer()], env.MetadataProgram);
    return publicKey;
}
exports.getMetadataAddress = getMetadataAddress;
async function getAssociatedAccountAddress(mint, owner) {
    return await splToken.getAssociatedTokenAddress(mint, owner, false);
}
exports.getAssociatedAccountAddress = getAssociatedAccountAddress;
//# sourceMappingURL=accounts.js.map