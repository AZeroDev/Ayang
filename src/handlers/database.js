const mongoose = require("mongoose");

module.exports = function load() {
    mongoose.connect(process.env.MongoUri)
    .then(() => console.log("Database telah terkoneksi."))
    .catch(console.error);
};