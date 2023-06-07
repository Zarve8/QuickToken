"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIContainer = void 0;
const portfolio_1 = require("./schemas/portfolio");
const company_1 = require("./schemas/company");
class DIContainer {
    constructor(connection, memoryAllocator) {
        this.container = new Map();
        this.bundle = [];
        this.bundleInstances = [];
        this.connection = connection;
        this.MA = memoryAllocator;
    }
    async getInstance(type, address) {
        const key = address.toBase58();
        if (this.container.has(key)) { //@ts-ignore
            return this.container.get(key);
        }
        const loadedData = this.MA.loadByName(key);
        if (loadedData) {
            const instance = new type(loadedData);
            this.container.set(key, instance);
            return instance;
        }
        const [instance, data] = await type.download(address, this.connection);
        this.container.set(key, instance);
        this.MA.writeByName(key, data);
        return instance;
    }
    async getPortfolioInstance(address) {
        return this.getInstance(portfolio_1.Portfolio, address);
    }
    async getCompanyInstance(address) {
        return this.getInstance(company_1.Company, address);
    }
    insert(instance, address, data) {
        const key = address.toBase58();
        this.container.set(key, instance);
        this.MA.writeByName(key, data);
    }
    insertIntoBundle(type, address) {
        const key = address.toBase58();
        const loadedData = this.MA.loadByName(key);
        if (loadedData) {
            const instance = new type(loadedData);
            this.container.set(key, instance);
            this.bundleInstances.push(instance);
            return;
        }
        this.bundle.push({ type, address });
    }
    async getBundle() {
        let instances = this.bundleInstances;
        const keys = this.bundle.map(({ type, address }) => address);
        if (keys.length > 0) {
            const infos = await this.connection.getMultipleAccountsInfo(keys);
            for (let i = 0; i < keys.length; i++) {
                const info = infos[i];
                if (info.data) {
                    if (info.data.length > 0) {
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
exports.DIContainer = DIContainer;
//# sourceMappingURL=dI_container.js.map