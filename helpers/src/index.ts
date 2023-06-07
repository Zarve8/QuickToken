export * from "./schemas";
export * from "./accounts";
export * from "./big-byte";
export * from "./dI_container";
export * from "./env";
export * from "./searchers"
export * from "./tx";
export {MemoryAllocator} from "./memory_allocator";


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