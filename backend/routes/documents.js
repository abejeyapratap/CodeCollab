const express = require("express");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

/* Unguarded Routes */
// return list of documents to "View" page in AG
// don't return content of document for faster loading in AG
router.get("", (req, res) => {});

/* Guarded Routes */
// return specific document for chat/comment based on :id
router.get("/:documentId", checkAuth, (req, res) => {});

// delete document based on :id
router.delete("/:documentId", checkAuth, (req, res) => {});

module.exports = router;
