import { Connection, PublicKey } from "@solana/web3.js";
import { Portfolio } from "./schemas/portfolio";
import { Company } from "./schemas/company";
import { IMemoryAllocator } from "./memory_allocator";
export declare class DIContainer {
    connection: Connection;
    container: Map<string, Object>;
    bundle: {
        type: any;
        address: PublicKey;
    }[];
    bundleInstances: object[];
    MA: IMemoryAllocator;
    constructor(connection: Connection, memoryAllocator: IMemoryAllocator);
    getInstance<T>(type: any, address: PublicKey): Promise<T>;
    getPortfolioInstance(address: PublicKey): Promise<Portfolio>;
    getCompanyInstance(address: PublicKey): Promise<Company>;
    insert(instance: object, address: PublicKey, data: Uint8Array): void;
    insertIntoBundle(type: any, address: PublicKey): void;
    getBundle(): Promise<object[]>;
}
//# sourceMappingURL=dI_container.d.ts.map