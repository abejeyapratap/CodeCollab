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
            { userId: req.user._id, email: req.user.email },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1h" } // secure against XSS security-attacks
        );
        res.cookie("coco_auth", token); // store JWT in cookie for Angular; { httpOnly: true }
        res.redirect("http://localhost:4200");
        
        // console.log(req.user.id, req.user.displayName, req.user.emails[0].value); // for profile
        // console.log(req.user.googleId, req.user.displayName, req.user.email); // for mongo user
    }
);

router.get("/failure", (req, res) => res.send("Log in failed."));

// TODO - maybe?
router.get("/logout", (req, res) => {
    req.logout(); // logout from Passport
    // delete cookie?
    res.redirect("http://localhost:4200");
});

module.exports = router;
