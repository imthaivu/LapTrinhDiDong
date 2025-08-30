"use strict";
Promise.race([simulateTask(2000), simulateTask(1000), simulateTask(1500)])
    .then((result) => {
    console.log("First finished:", result);
});
