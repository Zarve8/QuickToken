const {PublicKey} = require("@solana/web3.js");


async function getDeckAddress(collection, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('deck'),
            collection.toBuffer(),
        ],
        program
    );
    return a[0];
}

async function getOfferAddress(mint, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('offer'),
            mint.toBuffer(),
        ],
        program
    );
    return a[0];
}

async function getTreasuryAddress(mint, deck, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('treasury'),
            mint.toBuffer(),
            deck.toBuffer()
        ],
        program
    );
    return a[0];
}

async function getRaffleAddress(deck, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('raffle'),
            deck.toBuffer()
        ],
        program
    );
    return a[0];
}

async function getTicketAddress(owner, deck, program) {
    const a = await PublicKey.findProgramAddress(
        [
            Buffer.from('ticket'),
            deck.toBuffer(),
            owner.toBuffer()
        ],
        program
    );
    return a[0];
}


module.exports = {getDeckAddress, getOfferAddress, getTreasuryAddress, getRaffleAddress, getTicketAddress};