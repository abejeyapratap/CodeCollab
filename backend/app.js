const express = require("express");

const app = express();

// CORS Middleware
// const ANGULAR_ORIGIN = "http://localhost:4200";
// const WEBSOCKET_ORIGIN = "http://localhost:3000";
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", WEBSOCKET_ORIGIN); // filter domain
//     res.setHeader(
//         "Access-Control-Allow-Headers",
//         "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     ); // filter headers
//     res.setHeader(
//         "Access-Control-Allow-Methods",
//         "GET, POST, PUT, PATCH, DELETE, OPTIONS"
//     );
//     next();
// });

app.get("/", (req, res) => res.send("Hello"));

module.exports = app;
