process.on("unhandledRejection", error => console.error("[Unhandle]", error));
process.on("uncaughtException", error => console.error("[Uncaught]", error));

import("./src/index.js");