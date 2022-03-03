const connectedUsers = new Map();
const usersViewingDocs = new Map();

class ConnectedUser {
    apiKey = null;
    socket = null;
    viewingDocument = null;
    constructor(s) {
        this.socket = s;
    }
}

function onConnect(socket) {
    connectedUsers.set(socket.id, new ConnectedUser(socket));
    socket.emit('requestAPIKey');
}

function onDisconnect(user) {
    endViewingDocument(user);
    connectedUsers.delete(user.socket.id);
}

function isConnected(id) {
    return connectedUsers.has(id);
}

function sendAPIKey(user, key) {
    user.apiKey = key;
}

function logoutUser(user) {
    user.apiKey = null;
}

function viewDocument(user, documentID) {
    // TODO: Check to see document exists
    user.viewingDocument = documentID;
    if (!usersViewingDocs.has(documentID)) {
        usersViewingDocs.set(documentID, [])
    }
    usersViewingDocs.get(documentID).push(user.socket.id);
}

function endViewingDocument(user) {
    let docID = user.viewingDocument;
    if (docID == null) return;
    user.viewDocument = null;
    let uVD = usersViewingDocs.get(docID);
    let i = uVD.indexOf(user.socket.id);
    uVD.splice(i, 1);
    if (uVD.length < 1) {
        usersViewingDocs.delete(docID);
    }
}

function postComment(user, comment, line) {
    // TODO: save in database
    // TODO: send to all clients
}

function sendChatMessage(user, message) {
    // TODO: save in database
    // TODO: send to all clients
}

// We may decide not to use these
function requestDocumentsList(user) {

}

function createDocument(user, documentData) {

}

function deleteDocument(user, document) {

}