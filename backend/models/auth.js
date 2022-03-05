const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    displayName: { type: String, required: true },
    profilePic: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
