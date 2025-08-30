function mayFail(success: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      success ? resolve("All good!") : reject(new Error("Failed!"));
    }, 1000);
  });
}

mayFail(Math.random() > 0.5)
  .then((msg) => console.log("Success:", msg))
  .catch((err) => console.error("Error:", err.message))