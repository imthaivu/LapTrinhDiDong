"use strict";
function get10() {
    return new Promise((resolve) => {
        setTimeout(() => resolve(10), 1000);
    });
}
get10().then((n) => console.log("test:", n));
