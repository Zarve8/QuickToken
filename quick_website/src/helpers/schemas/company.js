"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Company = void 0;
const string_1 = require("./string");
const web3_js_1 = require("@solana/web3.js");
class Company {
    constructor(data, publicKey) {
        this.tag = data[0];
        this.owner = new web3_js_1.PublicKey(data.slice(1, 33));
        this.treasury = new web3_js_1.PublicKey(data.slice(33, 65));
        [this.name, data] = string_1.TString.deserialize(data.slice(65));
        [this.description, data] = string_1.TString.deserialize(data);
        this.publicKey = publicKey;
    }
    static async download(record, connection) {
        try {
            // @ts-ignore
            const data = (await connection.getAccountInfo(record)).data;
            return [new Company(data, record), data];
        }
        catch (e) {
            throw "Cannot parse Company at:" + record.toBase58();
        }
    }
}
exports.Company = Company;
//# sourceMappingURL=company.js.map