process.on("unhandledRejection", error => console.error(error));
process.on("uncaughtException", error => console.error(error));

import("./src/index.js");