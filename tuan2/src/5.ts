function siTak(time: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => resolve("xong"), time);
  });
}

siTak(1500).then((msg) => console.log(msg));
