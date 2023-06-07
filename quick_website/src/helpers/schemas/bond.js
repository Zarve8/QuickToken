"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bond = void 0;
const string_1 = require("./string");
const big_byte_1 = require("../big-byte");
const bn_js_1 = __importDefault(require("bn.js"));
class Bond {
    constructor(name, amount, rate, used, sold) {
        this.name = name;
        this.amount = amount;
        this.rate = rate;
        this.used = used;
        this.sold = sold;
    }
    static deserialize(data) {
        let name;
        [name, data] = string_1.TString.deserialize(data);
        const amount = (0, big_byte_1.fromLittleEndian)(data.slice(0, 8));
        const rate = new bn_js_1.default(data.slice(8, 10), "le").toNumber();
        const used = new bn_js_1.default(data.slice(10, 12), "le").toNumber();
        const sold = new bn_js_1.default(data.slice(12, 14), "le").toNumber();
        return [new Bond(name, amount, rate, used, sold), data.slice(14)];
    }
}
exports.Bond = Bond;
//# sourceMappingURL=bond.js.map