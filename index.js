process.on("unhandledRejection", error => console.error(error));
process.on("uncaughtException", error => console.error(error));

(async() => {
    await import("./src/index.js");
})();
