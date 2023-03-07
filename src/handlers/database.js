const mongoose = require("mongoose");

exports.load = () => {
    mongoose.connect(process.env.MongoUri)
    .then(() => console.log("Database telah terkoneksi."))
    .catch(console.error);
};