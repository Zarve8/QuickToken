"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portfolio = exports.PortfolioStatus = void 0;
const web3_js_1 = require("@solana/web3.js");
const vector_1 = require("./vector");
const bond_1 = require("./bond");
const big_byte_1 = require("../big-byte");
const bn_js_1 = __importDefault(require("bn.js"));
var PortfolioStatus;
(function (PortfolioStatus) {
    PortfolioStatus[PortfolioStatus["Created"] = 0] = "Created";
    PortfolioStatus[PortfolioStatus["Started"] = 1] = "Started";
    PortfolioStatus[PortfolioStatus["Sold"] = 2] = "Sold";
    PortfolioStatus[PortfolioStatus["Payed"] = 3] = "Payed";
})(PortfolioStatus = exports.PortfolioStatus || (exports.PortfolioStatus = {}));
class Portfolio {
    constructor(data, publicKey) {
        this.tag = data[0];
        this.company = new web3_js_1.PublicKey(data.slice(1, 33));
        this.token_storage = new web3_js_1.PublicKey(data.slice(33, 65));
        this.bump = data[65];
        this.status = data[66];
        //@ts-ignore
        this.period = (0, big_byte_1.fromLittleEndian)(data.slice(67, 75));
        //@ts-ignore
        this.end = (0, big_byte_1.fromLittleEndian)(data.slice(75, 83));
        this.image = data[83];
        [this.bonds, data] = vector_1.TVector.deserialize((0, vector_1.deserializeCarrier)(bond_1.Bond.deserialize), data.slice(84));
        const length = new bn_js_1.default(data.slice(0, 4), "le").toNumber();
        this.payout_mask = Array.from(data.slice(4, length + 4));
        this.publicKey = publicKey;
    }
    static async download(record, connection) {
        try {
            // @ts-ignore
            const data = (await connection.getAccountInfo(record)).data;
            return [new Portfolio(data, record), data];
        }
        catch (e) {
            throw "Cannot parse Portfolio at:" + record.toBase58();
        }
    }
}
exports.Portfolio = Portfolio;
//# sourceMappingURL=portfolio.js.map