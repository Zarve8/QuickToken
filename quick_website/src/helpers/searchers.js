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
exports.searchOwnedAssets = exports.searchSellingAssets = exports.searchCompaniesByOwner = void 0;
const env = __importStar(require("./env"));
const account_tag_1 = require("./schemas/account_tag");
const base_58_1 = __importDefault(require("base-58"));
const company_1 = require("./schemas/company");
const portfolio_1 = require("./schemas/portfolio");
const asset_1 = require("./schemas/asset");
const accounts_1 = require("./accounts");
async function searchCompaniesByOwner(owner, connection, DI) {
    const accounts = await connection.getProgramAccounts(env.QuickProgram, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: base_58_1.default.encode(Buffer.from([account_tag_1.AccountTag.Company])),
                },
            },
            {
                memcmp: {
                    offset: 1,
                    bytes: owner.toBase58(),
                },
            },
        ],
    });
    let companies = [];
    for (let i = 0; i < accounts.length; i++) {
        const data = accounts[i].account.data;
        const company = new company_1.Company(data, accounts[i].pubkey);
        DI.insert(company, company.publicKey, data);
        DI.insertIntoBundle(portfolio_1.Portfolio, await (0, accounts_1.getPortfolioAddress)(owner, company.publicKey));
        companies.push(company);
    } //@ts-ignore
    const portfolios = await DI.getBundle();
    return [companies, portfolios];
}
exports.searchCompaniesByOwner = searchCompaniesByOwner;
async function searchSellingAssets(connection, DI) {
    let assets = [];
    const portfolios = await connection.getProgramAccounts(env.QuickProgram, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: base_58_1.default.encode(Buffer.from([account_tag_1.AccountTag.Portfolio])),
                },
            },
            {
                memcmp: {
                    offset: 66,
                    bytes: base_58_1.default.encode(Buffer.from([portfolio_1.PortfolioStatus.Started])),
                },
            }
        ],
    });
    let portfolioAddresses = new Set();
    portfolios.forEach((a) => {
        portfolioAddresses.add(a.pubkey.toBase58());
    });
    //console.log("Here")
    //console.log(portfolioAddresses, "Portfolios");
    const allAssets = await connection.getProgramAccounts(env.QuickProgram, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: base_58_1.default.encode(Buffer.from([account_tag_1.AccountTag.Asset])),
                },
            }
        ],
    });
    //console.log(allAssets, "Assets")
    allAssets.forEach((a) => {
        const asset = new asset_1.Asset(a.account.data, a.pubkey);
        if (portfolioAddresses.has(asset.portfolio.toString()))
            assets.push(asset);
    });
    return assets;
}
exports.searchSellingAssets = searchSellingAssets;
async function searchOwnedAssets(owner, connection, DI) {
    let assets = [];
    let ownedAccountMints = new Set();
    const ownerAccounts = await connection.getParsedProgramAccounts(env.TokenProgram, {
        filters: [
            {
                dataSize: 165,
            },
            {
                memcmp: {
                    offset: 32,
                    bytes: owner.toBase58(),
                },
            },
            {
                memcmp: {
                    offset: 64,
                    bytes: base_58_1.default.encode(Buffer.from([1])),
                },
            },
        ],
    });
    //console.log(ownerAccounts)
    ownerAccounts.forEach((a) => {
        ownedAccountMints.add(a.account.data.parsed.info.mint);
    });
    const allAssets = await connection.getProgramAccounts(env.QuickProgram, {
        filters: [
            {
                memcmp: {
                    offset: 0,
                    bytes: base_58_1.default.encode(Buffer.from([account_tag_1.AccountTag.AssetSold])),
                },
            }
        ],
    });
    //console.log(ownedAccountMints, allAssets)
    allAssets.forEach((a) => {
        const asset = new asset_1.Asset(a.account.data, a.pubkey);
        if (ownedAccountMints.has(asset.mint.toString()))
            assets.push(asset);
    });
    return assets;
}
exports.searchOwnedAssets = searchOwnedAssets;
//# sourceMappingURL=searchers.js.map