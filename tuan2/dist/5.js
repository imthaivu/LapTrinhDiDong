"use strict";
function siTak(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve("xong"), time);
    });
}
siTak(1500).then((msg) => console.log(msg));
