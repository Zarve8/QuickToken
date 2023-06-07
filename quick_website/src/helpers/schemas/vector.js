"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TVector = exports.deserializeCarrier = exports.TDeserializable = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
class TDeserializable {
    static deserialize(data) { }
    ;
}
exports.TDeserializable = TDeserializable;
function deserializeCarrier(func) {
    return (data) => { return func(data); };
}
exports.deserializeCarrier = deserializeCarrier;
class TVector {
    constructor(length, array) {
        this.length = length;
        this.array = array;
    }
    static deserialize(deserialize, data) {
        const length = new bn_js_1.default(data.slice(0, 4), "le").toNumber();
        data = data.slice(4);
        let array = [];
        for (let i = 0; i < length; i++) {
            let child;
            [child, data] = deserialize(data);
            array.push(child);
        }
        return [new TVector(length, array), data];
    }
}
exports.TVector = TVector;
//# sourceMappingURL=vector.js.map