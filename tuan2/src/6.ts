function simulateTask(time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`all task done  ${time}ms`), time);
  });
}

Promise.all([simulateTask(1000), simulateTask(1500), simulateTask(500)])
  .then((results) => {
    console.log("ket qua:", results);
  });
