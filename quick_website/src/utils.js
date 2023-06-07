

class State {
    value;
    constructor(baseValue) {
        this.value = baseValue;
    }
    setValue(newValue) {
        this.value = newValue;
    }
}

async function getTime() {
    const slot = await global.connection.getSlot();
    return (await global.connection.getBlockTime(slot));
}

function periodToText(n) {
    const seconds = n % 60; n = Math.round(n / 60);
    const minutes = n % 60; n = Math.round(n / 60);
    const hours = n % 24; n = Math.round(n / 24);
    const days = n % 30; n = Math.round(n / 30);
    const months = n;
    if (months > 0) return months.toString()+"mon "+days.toString()+"d";
    if (days > 0) return days.toString()+"d "+hours.toString()+"h";
    if (hours> 0) return hours.toString()+"h "+minutes.toString()+"m";
    if (minutes > 0) return minutes.toString()+"m "+seconds.toString()+"s";
    return seconds.toString()+"s";
}

function remZeros(value){
    let index = value.length -1;
    while(index > 0 && value[index] === '0') index--;
    return value.slice(0, index+1);
}

function displayNumber(num, decimals){
    if(typeof(num) !== "string"){
        num = num.toString();
    }
    if(num === "0"){
        return "0";
    }
    if(decimals === 0){
        return num+",0";
    }
    if(num.length < (decimals+1)){
        const shift = (decimals+1) - num.length;
        const str = new Array(shift+1).join( '0' );
        num = str + num;
    }
    let complete = num.slice(0, -decimals);
    let fraction = remZeros(num.slice(-decimals))
    let index = 0;
    while((index < (fraction.length+1)) && (fraction[index]==='0')) index++;
    let end = index;
    for(let j = index; (j < fraction.length)&&(j < (index + 4)); j++) end++;
    fraction = fraction.slice(0, end);
    return complete + "," + fraction;
}

function rateToStr(rate, period) {
    const bpDec = 10000;
    const yearToSeconds = 365 * 24 * 60 * 60;
    rate = (rate * 100 * yearToSeconds) / (bpDec * period);
    rate = Math.round(rate * 100);
    return displayNumber(rate, 2);
}

function percentToRate(percent, period) {
    const value = Math.round((percent * period) / (365*24*36));
    console.log(percent, period, "->", value);
    return value;
}

module.exports = {State, getTime, periodToText, displayNumber, rateToStr, percentToRate};
