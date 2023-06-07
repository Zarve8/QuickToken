import {Connection, PublicKey} from "@solana/web3.js";
import {Portfolio} from "./schemas/portfolio";
import {Company} from "./schemas/company";
import {IMemoryAllocator} from "./memory_allocator";


export class DIContainer {
    connection: Connection;
    container: Map<string, Object> = new Map();
    bundle: {type: any, address: PublicKey}[] = [];
    bundleInstances: object[] = [];
    MA: IMemoryAllocator;
    constructor(connection: Connection, memoryAllocator: IMemoryAllocator) {
        this.connection = connection;
        this.MA = memoryAllocator;
    }
    async getInstance<T>(type: any, address: PublicKey): Promise<T> {
        const key = address.toBase58();
        if(this.container.has(key)) { //@ts-ignore
            return this.container.get(key);
        }
        const loadedData = this.MA.loadByName(key);
        if(loadedData) {
            const instance = new type(loadedData);
            this.container.set(key, instance);
            return instance;
        }
        const [instance, data] = await type.download(address, this.connection);
        this.container.set(key, instance);
        this.MA.writeByName(key, data);
        return instance;
    }
    async getPortfolioInstance(address: PublicKey) {
        return this.getInstance<Portfolio>(Portfolio, address);
    }
    async getCompanyInstance(address: PublicKey) {
        return this.getInstance<Company>(Company, address);
    }
    insert(instance: object, address: PublicKey, data: Uint8Array) {
        const key = address.toBase58();
        this.container.set(key, instance);
        this.MA.writeByName(key, data);
    }
    insertIntoBundle(type: any, address: PublicKey){
        const key = address.toBase58();
        const loadedData = this.MA.loadByName(key);
        if(loadedData) {
            const instance = new type(loadedData);
            this.container.set(key, instance);
            this.bundleInstances.push(instance);
            return;
        }
        this.bundle.push({type, address});
    }
    async getBundle() {
        let instances: object[] = this.bundleInstances;
        const keys = this.bundle.map(({type, address}) => address);
        if(keys.length > 0) {
            const infos = await this.connection.getMultipleAccountsInfo(keys);
            for(let i = 0; i < keys.length; i++) {
                const info = infos[i];
                if(info.data) {
                    if(info.data.length > 0){
                        const key = keys[i].toBase58();
                        const instance = new this.bundle[i].type(info.data, keys[i]);
                        this.MA.writeByName(key, info.data);
                        instances.push(instance);
                        this.container.set(key, instance);
                    }
                }
            }
        }
        this.bundle = [];
        this.bundleInstances = [];
        return instances;
    }
}