const express = require("express");
const checkAuth = require("../middleware/check-auth");

// Binary for file upload
const mongodb = require("mongodb");
const binary = mongodb.Binary;

const router = express.Router();
const fileUpload = require("express-fileupload");
router.use(fileUpload());

const Document = require("../models/document");
const User = require("../models/auth");

/* Unguarded Routes */
// return list of documents to "View" page in AG
router.get("", (req, res) => {
    Document.find()
        .sort({ createdAt: -1 })
        .then((documentsList) => {
            filteredCodeContentUsers(documentsList, res);
            // const filteredDocuments = filterCodeContent(documentsList);
            // res.json({
            //     message: "Documents fetched successfully!",
            //     documents: filteredDocuments,
            // });
        })
        .catch((err) => {
            console.log("Error with fetching all documents");
        });
});

// don't return content of document for faster loading in AG
function filterCodeContent(documentsList) {
    let filteredDocumentsList = [];

    for (let documentObj of documentsList) {
        filteredDocumentsList.push({
            id: documentObj._id,
            name: documentObj.name,
            creator: documentObj.creator,
        });
    }

    return filteredDocumentsList;
}

async function filteredCodeContentUsers(documentsList, res) {
    let filteredDocumentsList = [];

    for (let documentObj of documentsList) {
        let userD = await User.findOne({ _id: documentObj.creator });
        filteredDocumentsList.push({
            id: documentObj._id,
            name: documentObj.name,
            creator: userD.displayName,
        });
    }

    res.json({
        message: "Documents fetched successfully!",
        documents: filteredDocumentsList,
    });
}

/* Guarded Routes */
// return specific document for chat/comment based on :id
// need to be logged in to view??
router.get("/:documentId", (req, res) => {
    const id = req.params.documentId;

    Document.findById(id)
        .then((data) => {
            console.log("Found document!");
            res.json({
                message: "Document retrieved successfully!",
                document: data.codeContent,
            });
        })
        .catch((err) => {
            console.log("Error with GETting a document");
        });
});

// File upload
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
            res.status(201).json({
                message: "Document uploaded successfully!",
                documentId: result._id, // send back for Angular to re-route
            });
        })
        .catch((err) => {
            console.log(err),
                res.status(500).json({
                    error: err,
                });
        });
});

// delete document based on :id
router.delete("/:id", checkAuth, (req, res) => {
    console.log("Trying to delete");

    Document.deleteOne({
        _id: req.params.id,
        creator: req.userData.userId,
    }).then((result) => {
        // console.log(result);

        // if no documents deleted, the documentId did not match the creatorId also
        if (result["deletedCount"] > 0) {
            res.json({ message: "Success" });
        } else {
            res.status(401).json({ message: "Not authorized!" });
        }
    });
});

module.exports = router;
