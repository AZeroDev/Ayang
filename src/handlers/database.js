import mongoose from "mongoose";

export function handler() {
    mongoose.connect(process.env.MongoUri)
    .then(() => console.log("Database telah terkoneksi."))
    .catch(console.error);
}