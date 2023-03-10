const mongoose = require("mongoose");

const LevelingSchema = new mongoose.Schema({
    guildId: { type: String, default: "global" },
    userId: { type: String },
    level: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    dailyXp: { type: Number, default: 0 },
    dailyXpLimit: { type: Number, default: 5000 },
    lastUpdated: { type: Date, default: new Date() }
});

module.exports = mongoose.model("Leveling", LevelingSchema);