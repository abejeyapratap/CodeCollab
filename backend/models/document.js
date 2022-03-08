const mongoose = require("mongoose");

const documentsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    codeContent: {
        type: String,
        required: true,
    },
    // creator: { type: String, required: true },
});

// mongoose.Schema.Types.Subdocument

module.exports = mongoose.model("Document", documentsSchema);
