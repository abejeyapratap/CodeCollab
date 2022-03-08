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
    let user = new ConnectedUser(socket);
    connectedUsers.set(socket.id, user);
    socket.emit('requestAPIKey');
    return user;
}
exports.onConnect = onConnect;

function onDisconnect(user) {
    endViewingDocument(user);
    connectedUsers.delete(user.socket.id);
}
exports.onDisconnect = onDisconnect;

function isConnected(id) {
    return connectedUsers.has(id);
}

function sendAPIKey(user, key) {
    user.apiKey = key;
    // TODO: Retrieve the users display name and icon and save it here
}
exports.sendAPIKey = sendAPIKey;

function logoutUser(user) {
    user.apiKey = null;
    user.displayName = '';
    user.iconURL = '';
}
exports.logoutUser = logoutUser;

function viewDocument(user, documentID) {
    // console.log('viewingDoc');
    // TODO: Check to see document exists
    user.viewingDocument = documentID;
    if (!usersViewingDocs.has(documentID)) {
        usersViewingDocs.set(documentID, [])
    }
    usersViewingDocs.get(documentID).push(user.socket.id);
}
exports.viewDocument = viewDocument;

function endViewingDocument(user) {
    let docID = user.viewingDocument;
    if (docID == null) return;
    user.viewingDocument = null;
    let uVD = usersViewingDocs.get(docID);
    let i = uVD.indexOf(user.socket.id);
    uVD.splice(i, 1);
    if (uVD.length < 1) {
        usersViewingDocs.delete(docID);
    }
}
exports.endViewingDocument = endViewingDocument;

function postComment(user, comment, line) {
    if (user.apiKey == null || user.viewingDocument == null) return;

    // TODO: save in database
    let viewers = usersViewingDocs.get(user.viewingDocument);
    for (let u of viewers) {
        connectedUsers.get(u).socket.emit('newComment', [user.displayName, user.iconURL, comment, Date.now(), line]);
    }
}
exports.postComment = postComment;

function sendChatMessage(user, message) {
    // console.log('chat message');
    if (user.viewingDocument == null) return;

    let viewers = usersViewingDocs.get(user.viewingDocument);
    for(let u of viewers) {
        connectedUsers.get(u).socket.emit('newChatMessage', [user.displayName, user.iconURL, message, Date.now()]);
    }
}
exports.sendChatMessage = sendChatMessage;

// We may decide not to use these
function requestDocumentsList(user) {

}

function createDocument(user, documentData) {

}

function deleteDocument(user, document) {

}