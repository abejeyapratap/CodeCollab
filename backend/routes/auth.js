const express = require("express");
const passport = require("passport");
require("../passport");
const jwt = require("jsonwebtoken");

const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const User = require("../models/auth");

// Fetch user profile info by token
router.get("/userInfo", checkAuth, (req, res) => {
    User.findOne({ _id: req.userData.userId })
        .then((user) => {
            const fetchedUser = {
                userId: user._id,
                displayName: user.displayName,
                profilePic: user.profilePic,
            };

            res.json({
                message: "User profile fetched successfully!",
                user: fetchedUser,
            });
        })
        .catch((err) => {
            console.log("Couldn't fetch user");
        });
});

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
        // res.redirect(process.env.ANGULAR_CLIENT_URL);
        res.redirect("/");

        // console.log(req.user.id, req.user.displayName, req.user.emails[0].value); // for profile
        // console.log(req.user.googleId, req.user.displayName, req.user.email); // for mongo user
    }
);

// TODO - maybe?
router.get("/failure", (req, res) => {
    res.status(500);
    // res.redirect(process.env.ANGULAR_CLIENT_URL);
    res.redirect("/");

});

module.exports = router;
