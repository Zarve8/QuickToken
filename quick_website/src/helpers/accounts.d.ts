import { PublicKey } from "@solana/web3.js";
export declare function getCompanyAddress(auth: PublicKey, salt: PublicKey): Promise<PublicKey>;
export declare function getPortfolioAddress(auth: PublicKey, company: PublicKey): Promise<PublicKey>;
export declare function getStorageAddress(portfolio: PublicKey, mint: PublicKey): Promise<PublicKey>;
export declare function getAssetAddress(portfolio: PublicKey, mint: PublicKey): Promise<PublicKey>;
export declare function getMetadataAddress(mint: PublicKey): Promise<PublicKey>;
export declare function getAssociatedAccountAddress(mint: PublicKey, owner: PublicKey): Promise<PublicKey>;
//# sourceMappingURL=accounts.d.ts.map