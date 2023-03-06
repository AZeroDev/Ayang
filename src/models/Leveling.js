import mongoose from "mongoose";

const LevelingSchema = new monggose.Schema({
    guildId: { type: String },
    userId: { type: String },
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    dailyXp: { type: Number, default: 0 },
    dailyXpLimit: { type: Number, default: 5000 },
    lastUpdated: { type: Date, default: new Date() }
});

export default mongoose.model("Leveling", LevelingSchema);