const express = require("express");
// const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const Comment = require("../models/comment");

// Comments are created via WebSocket connection
function saveCommentInDB(commentContent, creator, documentId, lineNumber, iconURL) {
    const comment = new Comment({
        content: commentContent,
        creator: creator,
        document: documentId,
        line: lineNumber,
        profilePic: iconURL
    });

    comment
        .save()
        .then((savedComment) => {
            // console.log(savedComment);
            // return savedComment;
        })
        .catch((err) => {
            console.log("Couldn't save comment to DB");
        });
}

// return list of comments for specific page
function getCommentsFromDB(documentId) {
    return Comment.find({ document: documentId });
}

// router.get("", (req, res) => {});

module.exports = {
    router: router,
    saveCommentInDB: saveCommentInDB,
    getCommentsFromDB: getCommentsFromDB,
};
