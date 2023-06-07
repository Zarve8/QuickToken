import {PublicKey, Connection} from "@solana/web3.js";
import * as env from "./env";
import {AccountTag} from "./schemas/account_tag";
import {DIContainer} from "./dI_container";
import Base58 from "base-58"
import {Company} from "./schemas/company";
import {Portfolio, PortfolioStatus} from "./schemas/portfolio";
import {Asset} from "./schemas/asset";
import {getAssetAddress, getPortfolioAddress} from "./accounts";


export async function searchCompaniesByOwner(owner: PublicKey, connection: Connection, DI: DIContainer): Promise<[Company[], Portfolio[]]>
{
    const accounts = await connection.getProgramAccounts(
        env.QuickProgram,
        {
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: Base58.encode(Buffer.from([AccountTag.Company as number])),
                    },
                },
                {
                    memcmp: {
                        offset: 1,
                        bytes: owner.toBase58(),
                    },
                },
            ],
        }
    );
    let companies: Company[] = [];
    for(let i = 0; i < accounts.length; i++) {
        const data = accounts[i].account.data;
        const company = new Company(data, accounts[i].pubkey);
        DI.insert(company, company.publicKey, data);
        DI.insertIntoBundle(Portfolio, await getPortfolioAddress(owner, company.publicKey));
        companies.push(company);
    }//@ts-ignore
    const portfolios: Portfolio[] = await DI.getBundle();
    return [companies, portfolios];
}


export async function searchSellingAssets(connection: Connection, DI: DIContainer): Promise<Asset[]> {
    let assets: Asset[] = [];
    const portfolios = await connection.getProgramAccounts(
        env.QuickProgram,
        {
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: Base58.encode(Buffer.from([AccountTag.Portfolio as number])),
                    },

                },
                {
                    memcmp: {
                        offset: 66,
                        bytes: Base58.encode(Buffer.from([PortfolioStatus.Started as number])),
                    },
                }
            ],
        }
    );
    let portfolioAddresses: Set<string> = new Set();
    portfolios.forEach((a) => { //@ts-ignore
        portfolioAddresses.add(a.pubkey.toBase58());
    });
    //console.log("Here")
    //console.log(portfolioAddresses, "Portfolios");
    const allAssets = await connection.getProgramAccounts(
        env.QuickProgram,
        {
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: Base58.encode(Buffer.from([AccountTag.Asset as number])),
                    },

                }
            ],
        }
    );
    //console.log(allAssets, "Assets")
    allAssets.forEach((a) => {
        const asset = new Asset(a.account.data, a.pubkey);
        if(portfolioAddresses.has(asset.portfolio.toString())) assets.push(asset);
    })
    return assets
}


export async function searchOwnedAssets(owner: PublicKey, connection: Connection, DI: DIContainer): Promise<Asset[]> {
    let assets: Asset[] = [];
    let ownedAccountMints: Set<string> = new Set();
    const ownerAccounts = await connection.getParsedProgramAccounts(
        env.TokenProgram,
        {
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
                        bytes: Base58.encode(Buffer.from([1])),
                    },
                },
            ],
        }
    );
    //console.log(ownerAccounts)
    ownerAccounts.forEach((a) => { //@ts-ignore
        ownedAccountMints.add(a.account.data.parsed.info.mint);
    });
    const allAssets = await connection.getProgramAccounts(
        env.QuickProgram,
        {
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        bytes: Base58.encode(Buffer.from([AccountTag.AssetSold as number])),
                    },

                }
            ],
        }
    );
    //console.log(ownedAccountMints, allAssets)
    allAssets.forEach((a) => {
        const asset = new Asset(a.account.data, a.pubkey);
        if(ownedAccountMints.has(asset.mint.toString())) assets.push(asset);
    })
    return assets
}