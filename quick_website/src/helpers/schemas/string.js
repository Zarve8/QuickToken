"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TString = void 0;
const big_byte_1 = require("../big-byte");
const bn_js_1 = __importDefault(require("bn.js"));
const big_integer_1 = __importDefault(require("big-integer"));
class TString {
    constructor(length, array, value) {
        this.length = length;
        this.array = array;
        this.value = value;
    }
    static deserialize(data) {
        const length = new bn_js_1.default(data.slice(0, 4), "le").toNumber();
        const array = data.slice(4, length + 4);
        const value = String.fromCharCode(...array);
        return [new TString(length, array, value), data.slice(length + 4)];
    }
    static fromString(s) {
        const length = s.length;
        let array = Buffer.from(s, 'utf-8');
        return new TString(length, new Uint8Array(array), s);
    }
    serialize() {
        let data = Array.from((0, big_byte_1.toLittleEndian)((0, big_integer_1.default)(this.length.toString()), 4));
        data = data.concat(Array.from(this.array));
        return new Uint8Array(data);
    }
}
exports.TString = TString;
//# sourceMappingURL=string.js.map