const connectedUsers = new Map();

class ConnectedUser {
    apiKey = null;
    socket = null;
    constructor(s) {
        this.socket = s;
    }
}

function onConnect(socket) {
    connectedUsers.set(socket.id, new ConnectedUser(socket));
    socket.emit('requestAPIKey');
}

function onDisconnect(socket) {
    connectedUsers.delete(socket.id);
}

function sendAPIKey(user, key) {
    user.apiKey = key;
}

function logoutUser(user) {
    user.apiKey = null;
}

function requestDocumentsList(user) {

}

function requestDocument(user) {

}

function postComment(user, commentData) {

}

function sendChatMessage(user, message) {

}

function createDocument(user, documentData) {

}

function deleteDocument(user, document) {

}