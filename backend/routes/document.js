const express = require("express");
const checkAuth = require("../middleware/check-auth");

// Binary for file upload
const mongodb = require("mongodb");
const binary = mongodb.Binary;

const router = express.Router();
const fileUpload = require("express-fileupload");
router.use(fileUpload());

const Document = require("../models/document");

let currId = ""; // DELETE

// POST User
router.post("/create", checkAuth, (req, res) => {
    // console.log(req.files.codeContent.data);
    const document = new Document({
        name: req.body.name,
        codeContent: binary(req.files.codeContent.data).toString(),
        creator: req.userData.userId,
    });

    // console.log(req.userData);
    document
        .save()
        .then((result) => {
            // console.log(result);
            currId = result._id;
            console.log("CURRENT ID: ", currId);
            res.status(201).json({
                message: "document registered successfully!",
                documentCreated: {
                    //_id: result._id,
                    name: result.name,
                    codeContent: result.codeContent,
                },
            });
        })
        .catch((err) => {
            console.log(err),
                res.status(500).json({
                    error: err,
                });
        });
});

// GET Document
router.get("/get-document", (req, res) => {
    console.log("ID to search: ", currId);
    Document.findById(currId).then((data) => {
        console.log(data);
        res.status(200).json({
            message: "documents retrieved successfully!",
            results: data.codeContent,
        });
    });
});

/* Unguarded Routes */
// return list of documents to "View" page in AG
// don't return content of document for faster loading in AG
// router.get("", (req, res) => {});

/* Guarded Routes */
// return specific document for chat/comment based on :id
// router.get("/:documentId", checkAuth, (req, res) => {});

// delete document based on :id
router.delete("/:id", checkAuth, (req, res) => {
    console.log("deleting");
    Document.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId,
    }).then((result) => {
        // console.log(result);

        // if no documents deleted, the documentId did not match the creatorId also
        if (result["deletedCount"] > 0) {
            res.json({ message: "Deletion successful!" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    });
});

module.exports = router;
