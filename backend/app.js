const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
require("./passport");
const jwt = require("jsonwebtoken");

const app = express();

mongoose
    .connect(
        "mongodb+srv://abejeyapratap:" +
            process.env.MONGO_ATLAS_PW +
            "@cluster0.5a7ml.mongodb.net/code-collab?retryWrites=true&w=majority"
    )
    .then(() => {
        console.log("Connected to database");
    })
    .catch(() => {
        console.log("Connection failed");
    });

// CORS Middleware
const ANGULAR_ORIGIN = "http://localhost:4200";
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", ANGULAR_ORIGIN); // filter domain
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    ); // filter headers
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.get("/", (req, res) => res.send("Hello"));

// Google login "prompt"
// Scope: what info we want from Google user-profile
app.get(
    "/auth/google",
    passport.authenticate("google", {
        session: false,
        scope: ["profile", "email"],
    })
);

// Authenticate w/ Google and re-direct
app.get(
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

app.get("/failure", (req, res) => res.send("Log in failed."));

// TODO
app.get("/logout", (req, res) => {
    req.logout(); // logout from Passport
    res.redirect("http://localhost:4200");
});

module.exports = app;
