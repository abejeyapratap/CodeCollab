const express = require("express");
const passport = require("passport");
require("../passport");
const jwt = require("jsonwebtoken");

const User = require("../models/auth");

const router = express.Router();

// Google login "prompt"
// Scope: what info we want from Google user-profile
router.get(
    "/google",
    passport.authenticate("google", {
        session: false,
        scope: ["profile", "email"],
    })
);

// Authenticate w/ Google and re-direct
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/failure", // TODO
    }),
    (req, res) => {
        // Generate JWT for Angular
        const token = jwt.sign(
            { userGoogleId: req.user.id, userEmail: req.user.emails[0].value },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" }
        );
        res.cookie("coco_auth", token); // store token in cookie for use by Angular
        res.redirect("http://localhost:4200");
        // console.log(req.user.id, req.user.displayName, req.user.emails[0].value);
    }
);

router.get("/failure", (req, res) => res.send("Log in failed."));

// TODO
router.get("/logout", (req, res) => {
    req.logout(); // logout from Passport
    res.redirect("http://localhost:4200");
});

module.exports = router;
