import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    suspended: {
        type: Boolean,
        default: false,
    },
    id: String,
    commandUsed: Number,
});

export default mongoose.model("User", UserSchema);