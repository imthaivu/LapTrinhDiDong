"use strict";
function sai() {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error("err")), 1000);
    });
}
sai().catch((err) => console.error(err.message));
