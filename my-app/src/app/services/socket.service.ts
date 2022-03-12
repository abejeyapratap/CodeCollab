import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  documentListRequest: any = null;
  documentViewRequest: any = null;

  constructor(private socket: Socket, private auth:AuthService) {
    socket.on('requestAPIKey', () => {
      this.onRequestAPIKey(this);
    });

    socket.on('documentsList', this.onDocumentsList);
    socket.on('document', this.onDocument);
  }

  onRequestAPIKey(s: SocketService) {
    let key = this.auth.getToken();
    if (key != '')
      s.sendAPIKey(key);
  }

  sendAPIKey(key: string) {
    this.socket.emit('sendAPIKey', key);
  }

  sendLogout() {
    this.socket.emit('logout');
  }

  onUserLogin() {
    // When another user logs in to the website
    // Message: displayName: string
    // Display the chat message
    return this.socket.fromEvent('remoteUserLogin');
    // How to use:
    // this.socketService.onUserLogin().subscribe((data: any) => this.movies = data)
  }

  onUserLogout() {
    // When another user logs in to the website
    // Message: displayName: string
    // Display the chat message
    return this.socket.fromEvent('remoteUserLogout');
    // How to use:
    // this.socketService.onUserLogout().subscribe((data: any) => this.movies = data)
  }

  sendChatMessage(message: string) {
    this.socket.emit('sendChatMessage', message);
  }

  onNewChatMessage() {
    // Message: senderName: string, senderIcon: string, message: string, time: number
    // Display the chat message
    return this.socket.fromEvent<any[]>('newChatMessage');
    // How to use:
    // this.socketService.onNewChatMessage().subscribe((data: any) => this.movies = data)
  }

  postComment(comment: string, line: number) {
    this.socket.emit('postComment', comment, line);
  }

  onNewComment() {
    // Message: senderName: string, senderIcon: string, message: string, time: number, line:number
    // Display the chat message
    return this.socket.fromEvent<any[]>('newComment');
    // How to use:
    // this.socketService.onNewComment().subscribe((data: any) => this.movies = data)
  }

  // These might get removed but I'll keep them for now
  getDocumentsList() {
    if (this.documentListRequest != null) {
      return this.documentListRequest;
    }
    this.socket.emit('requestDocumentsList');
    this.documentListRequest = new Promise<string>(() => {});
    return this.documentListRequest;
  }

  onDocumentsList(data: string) {
    if (this.documentListRequest == null) return;
    this.documentListRequest.resolve(data);
    this.documentListRequest = null;
  }

  viewDocument(documentID: string) {
    this.socket.emit('viewDocument', documentID);
  }

  onDocument(data: string, error: boolean) {
    if (this.documentViewRequest == null) return;
    if (error) {
      this.documentViewRequest.reject(data);
    } else {
      this.documentViewRequest.resolve(data);
    }
    this.documentViewRequest = null;
  }

  endViewingDocument() {
    this.socket.emit('endViewingDocument');
  }
}
