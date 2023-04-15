const {PublicKey} = require("@solana/web3.js");


async function getCompanyAddress(auth, salt, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('company'),
            program.toBuffer(),
            auth.toBuffer(),
            salt.toBuffer()
        ],
        program
    );
    return a[0];
}

async function getPortfolioAddress(auth, company, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('portfolio'),
            program.toBuffer(),
            auth.toBuffer(),
            company.toBuffer()
        ],
        program
    );
    return a[0];
}

async function getStorageAddress(portfolio, mint, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('vault'),
            program.toBuffer(),
            portfolio.toBuffer(),
            mint.toBuffer()
        ],
        program
    );
    return a[0];
}

async function getAssetAddress(portfolio, mint, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('asset'),
            program.toBuffer(),
            portfolio.toBuffer(),
            mint.toBuffer()
        ],
        program
    );
    return a[0];
}


module.exports = {getCompanyAddress, getStorageAddress, getAssetAddress, getPortfolioAddress};