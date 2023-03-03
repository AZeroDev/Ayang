process.on("unhandledRejection", error => console.error(error));
process.on("uncaughtException", error => console.error(error));
process.on("warning", (warn) => console.warn("[Warning!]", warn.name, warn.message));

import("./src/index.js");