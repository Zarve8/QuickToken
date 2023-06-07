import { PublicKey, Connection } from "@solana/web3.js";
import { DIContainer } from "./dI_container";
import { Company } from "./schemas/company";
import { Portfolio } from "./schemas/portfolio";
import { Asset } from "./schemas/asset";
export declare function searchCompaniesByOwner(owner: PublicKey, connection: Connection, DI: DIContainer): Promise<[Company[], Portfolio[]]>;
export declare function searchSellingAssets(connection: Connection, DI: DIContainer): Promise<Asset[]>;
export declare function searchOwnedAssets(owner: PublicKey, connection: Connection, DI: DIContainer): Promise<Asset[]>;
//# sourceMappingURL=searchers.d.ts.map