const Swal = require("sweetalert2");


async function alertError(e) {
    Swal.fire({
        position: 'top',
        title: e.toString(),
        showConfirmButton: false,
        timer: 1000,
        background: "#f18181",
        color: "#FFFDFD",
    });
}

async function alertTx() {
    Swal.fire({
        position: 'top',
        title: "Transaction Succeed",
        showConfirmButton: false,
        timer: 1000,
        background: "#2ED69B",
        color: "#FFFDFD",
    });
}

async function alertConfirm() {
    Swal.fire({
        position: 'bottom-left',
        title: "Transaction Confirmed",
        showConfirmButton: false,
        timer: 600,
        background: "#2ED69B",
        color: "#FFFDFD",
    });
}


global.alertTx = alertTx;
global.alertError = alertError;
global.alertConfirm = alertConfirm;
module.exports = {alertError, alertTx, alertConfirm};