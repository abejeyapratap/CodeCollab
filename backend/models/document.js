const mongoose = require("mongoose");

const documentSchema = mongoose.Schema({
    name: { type: String, required: true }, // document's title
    codeContent: { type: String, required: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId, // mongo id of user who created
        ref: "User", // document is related to user
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", documentSchema);
