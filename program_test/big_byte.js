const BigInteger = require("big-integer");


const zero = BigInteger(0);
const n256 = BigInteger(256);

function toLittleEndian(bigNumber, length){
    let result = new Uint8Array(length);
    let i = 0;
    while (bigNumber.greater(zero)) {
        result[i] = bigNumber.mod(n256);
        bigNumber = bigNumber.divide(n256);
        i += 1;
    }
    return result;
}


module.exports = {toLittleEndian};