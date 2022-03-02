const http = require("http");
const app = require("./backend/app");
const debug = require("debug")("node-angular");
const { Server } = require('socket.io');


// Ensure port is valid number
const normalizePort = (val) => {
    let portNumber = parseInt(val, 10);

    if (isNaN(portNumber)) {
        // named pipe
        return val;
    }

    if (portNumber >= 0) {
        // port number
        return portNumber;
    }

    return false;
};

// Check what type of error occurs & exit gracefully
const onError = (error) => {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
};

// Log to Console
const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Use Express app to start Server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"]
    }
  });

server.on("error", onError);
server.on("listening", onListening);

io.on('connection', (socket) => {
    console.log('User connected ' + socket.id);
});

server.listen(port);

// Ryan's comments for reference :)
// <script src="https://cdn.socket.io/4.4.1/socket.io.min.js" integrity="sha384-fKnu0iswBIqkjxrhQCTZ7qlLHOFEgNkRmK2vaO/LbTZSXdJfAu6ewRBdwHPhBo/H" crossorigin="anonymous"></script>

//const http = require('http');
//const server = http.createServer(app);
//const io = new Server(server);
// const io = new Server();
