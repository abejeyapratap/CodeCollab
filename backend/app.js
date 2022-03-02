const express = require("express");
const passport = require("passport");
require("./passport");

const app = express();

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

// authenticate w/ Google and re-direct
app.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/failure", // TODO
    }),
    (req, res) => {
        console.log(req.user.id);
        res.redirect("http://localhost:4200");
    }
);

app.get("/failure", (req, res) => res.send("Log in failed."));

app.get("/logout", (req, res) => {
    req.logout(); // logout from Passport
    res.redirect("http://localhost:4200");
});

module.exports = app;
