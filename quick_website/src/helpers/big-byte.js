"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLittleEndian = exports.fromLittleEndian = void 0;
const big_integer_1 = __importDefault(require("big-integer"));
//@ts-ignore
const zero = (0, big_integer_1.default)(0);
//@ts-ignore
const one = (0, big_integer_1.default)(1);
//@ts-ignore
const n256 = (0, big_integer_1.default)(256);
function fromLittleEndian(bytes) {
    let result = zero;
    let base = one;
    bytes.forEach(function (byte) {
        result = result.add(base.multiply((0, big_integer_1.default)(byte)));
        base = base.multiply(n256);
    });
    //@ts-ignore
    return result;
}
exports.fromLittleEndian = fromLittleEndian;
function toLittleEndian(bigNumber, length) {
    //@ts-ignore
    let result = new Uint8Array(length);
    let i = 0;
    while (bigNumber.greater(zero)) {
        result[i] = bigNumber.mod(n256);
        bigNumber = bigNumber.divide(n256);
        i += 1;
    } //@ts-ignore
    return result;
}
exports.toLittleEndian = toLittleEndian;
//# sourceMappingURL=big-byte.js.map