"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryAllocator = void 0;
__exportStar(require("./schemas"), exports);
__exportStar(require("./accounts"), exports);
__exportStar(require("./big-byte"), exports);
__exportStar(require("./dI_container"), exports);
__exportStar(require("./env"), exports);
__exportStar(require("./searchers"), exports);
__exportStar(require("./tx"), exports);
var memory_allocator_1 = require("./memory_allocator");
Object.defineProperty(exports, "MemoryAllocator", { enumerable: true, get: function () { return memory_allocator_1.MemoryAllocator; } });
/*
import {Connection, PublicKey} from "@solana/web3.js";
import {searchCompaniesByOwner, searchOwnedAssets, searchPortfoliosByOwner, searchSellingAssets} from "./searchers";
import {DIContainer} from "./dI_container";


async function Do() {
    const connection = new Connection("https://api.devnet.solana.com");
    const company = new PublicKey("26hChtwjHzCWnfe8fSuYGLkoWASdK5HmGWQfKvukmA6n");
    const portfolio = new PublicKey("ASdiLSuUGhMzRmD9tSTMfqdKcvxTbyfYMjE48yBo5VZG");
    const asset = new PublicKey("a8FvMMSiQQj9kg6HncJ7hYziBbLedkc4nA4PAe8vWcN");
    //const C = await Company.download(company, connection);
    //const P = await Portfolio.download(portfolio, connection);
    //const A = await Asset.download(asset, connection);
    //await searchAssets(connection, new DIContainer());
    //const C = await searchCompaniesByOwner(new PublicKey("69sjcqBTHVMjMDm1ve2fAYRfz2GBnzKKVXkXwDBiscPT"), connection);
    //const Ps = await searchPortfoliosByOwner(C, connection);
    const DI = new DIContainer(connection);
    console.log(await searchSellingAssets(connection, DI));
    //await searchOwnedAssets(new PublicKey("69sjcqBTHVMjMDm1ve2fAYRfz2GBnzKKVXkXwDBiscPT"), connection, DI);
}

Do();

*/ 
//# sourceMappingURL=index.js.map