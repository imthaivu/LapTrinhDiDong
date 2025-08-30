"use strict";
const p1 = new Promise((resolve) => {
    setTimeout(() => {
        resolve("Hello Async");
    }, 2000);
});
p1.then((msg) => console.log(msg));
