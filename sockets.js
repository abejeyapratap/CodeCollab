const connectedUsers = new Map();
const usersViewingDocs = new Map();

class ConnectedUser {
    apiKey = null;
    socket = null;
    viewingDocument = null;

    displayName = '';
    iconURL = '';

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
    // TODO: Retrieve the users display name and icon and save it here
}

function logoutUser(user) {
    user.apiKey = null;
    user.displayName = '';
    user.iconURL = '';
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
    let viewers = usersViewingDocs.get(user.viewingDocument);
    for(let u of viewers) {
        connectedUsers.get(u).socket.emit('newComment', user.displayName, user.iconURL, comment, line, Date.now());
    }
}

function sendChatMessage(user, message) {
    if (user.viewDocument == null) return;

    let viewers = usersViewingDocs.get(user.viewingDocument);
    for(let u of viewers) {
        connectedUsers.get(u).socket.emit('newChatMessage', user.displayName, user.iconURL, comment, Date.now());
    }
}

// We may decide not to use these
function requestDocumentsList(user) {

}

function createDocument(user, documentData) {

}

function deleteDocument(user, document) {

}