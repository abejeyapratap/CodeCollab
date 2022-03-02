const express = require("express");
const mongoose = require("mongoose");

const userRoutes = require("./routes/auth");

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

app.use("/api/auth", userRoutes); // forward requests to /api/auth to userRoutes

module.exports = app;
