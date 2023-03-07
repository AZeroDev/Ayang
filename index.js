process.on("unhandledRejection", error => console.error(error));
process.on("uncaughtException", error => console.error(error));

require("./src/index.js");