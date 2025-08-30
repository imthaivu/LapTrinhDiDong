function randomNumber(): Promise<number> {
  return new Promise((resolve, reject) => {
    const num = Math.random();
    if (num > 0.2) {
      resolve(num);
    } else {
      reject(new Error("num < 0.2"));
    }
  });
}

randomNumber()
  .then((n) => console.log("co num:", n))
  .catch((err) => console.error("Error:", err.message));
