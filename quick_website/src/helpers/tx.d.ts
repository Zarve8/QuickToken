import { PublicKey, Keypair, TransactionInstruction } from "@solana/web3.js";
import { Portfolio, Portfolio as TPortfolio } from "./schemas/portfolio";
import { Asset } from "./schemas/asset";
import { Company } from "./schemas/company";
export declare function createCompanyTx(owner: PublicKey, name: string, description: string): Promise<[TransactionInstruction, PublicKey]>;
export declare function createPortfolioTx(owner: PublicKey, Company: PublicKey, bondCount: number, image: number): Promise<[TransactionInstruction, PublicKey]>;
export declare function insertBondTx(owner: PublicKey, Company: PublicKey, Portfolio: PublicKey, name: string, rate: string, amount: string): Promise<TransactionInstruction>;
export declare function startPortfolioTx(owner: PublicKey, Company: PublicKey, Portfolio: PublicKey, period: string): Promise<TransactionInstruction>;
export declare function mintAssetTx(owner: PublicKey, Company: PublicKey, Portfolio: PublicKey, url_id: number, mask: number[]): Promise<(Keypair | TransactionInstruction)[]>;
export declare function payoutTx(owner: PublicKey, portfolio: TPortfolio, mask: number[]): Promise<TransactionInstruction>;
export declare function stopSalesTx(owner: PublicKey, portfolio: TPortfolio): Promise<TransactionInstruction>;
export declare function buyAssetTx(owner: PublicKey, asset: Asset, portfolio: Portfolio, company: Company): Promise<TransactionInstruction>;
export declare function cashOutTx(owner: PublicKey, asset: Asset, portfolio: Portfolio, company: Company): Promise<TransactionInstruction>;
//# sourceMappingURL=tx.d.ts.map