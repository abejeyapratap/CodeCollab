const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/auth");
const documentRoutes = require("./routes/document");

const app = express();

// Serve static files in angular/ directory
app.use("/", express.static(path.join(__dirname, "angular")));

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
const ANGULAR_ORIGIN = process.env.ANGULAR_CLIENT_URL;
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); // filter domain
    // res.setHeader("Access-Control-Allow-Origin", ANGULAR_ORIGIN); // filter domain
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
app.use("/api/documents", documentRoutes); // forward requests to /api/documents

// Render Angular app for all requests NOT to routes defined above
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "angular", "index.html"));
});

module.exports = app;
