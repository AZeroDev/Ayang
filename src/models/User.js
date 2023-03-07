const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    suspended: {
        type: Boolean,
        default: false,
    },
    id: String,
    commandUsed: Number,
});

module.exports = mongoose.model("User", UserSchema);