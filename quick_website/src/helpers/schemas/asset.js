"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Asset = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
class Asset {
    constructor(data, publicKey) {
        this.tag = data[0];
        this.portfolio = new web3_js_1.PublicKey(data.slice(1, 33));
        this.mint = new web3_js_1.PublicKey(data.slice(33, 65));
        this.image = data[65];
        const length = new bn_js_1.default(data.slice(66, 70), "le").toNumber();
        this.participation = Array.from(data.slice(70, length + 70));
        this.publicKey = publicKey;
    }
    static async download(record, connection) {
        try {
            // @ts-ignore
            const data = (await connection.getAccountInfo(record)).data;
            return [new Asset(data, record), data];
        }
        catch (e) {
            throw "Cannot parse Asset at:" + record.toBase58();
        }
    }
}
exports.Asset = Asset;
//# sourceMappingURL=asset.js.map