const mongoose = require("mongoose");

const documentsSchema = mongoose.Schema({
    title: { type: String, required: true },
    creator: { type: String, required: true },
});

// mongoose.Schema.Types.Subdocument

module.exports = mongoose.model("Documents");
