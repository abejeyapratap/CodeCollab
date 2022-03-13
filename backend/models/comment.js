const mongoose = require("mongoose");

/* Comments are related to a specific document and specific user */
const commentSchema = mongoose.Schema({
    content: { type: String, required: true },
    creator: { type: String, required: true },
    profilePic: { type: String },
    /* creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }, */
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
        required: true,
    },
    line: { type: Number },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Comment", commentSchema);
