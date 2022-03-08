import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { transition, style, animate, trigger } from '@angular/animations';

const leaveTrans = transition(':leave', [
  style({
    opacity: 1
  }),
  animate('7s ease-out', style({
    opacity: 0
  }))
])

const fadeOut = trigger('fadeOut', [
  leaveTrans
]);

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  animations: [
    fadeOut
  ]
})
export class ViewComponent implements OnInit {

  constructor(private sockets:SocketService) { }

  messages: MessageData[] = [];
  newMessage = '';
  myDisplayName: string = '';

  documentLines:string[] = ["function foo() {", "\treturn 0;", "}"]

  ngOnInit(): void {
    this.sockets.onNewChatMessage().subscribe((data) => { this.addChatMessage(data[0], data[1], data[2], data[3]) })
  }

  addChatMessage(username: string, icon: string, msg: string, date: number): void {
    this.messages.push(new MessageData(username, icon, msg, date));
  }

  sendChatMessage() {
    this.sockets.sendChatMessage(this.newMessage);
    this.newMessage = '';
  }

  startComment(line:number) {
    console.log(`comment on line ${line}`);
  }

  deleteConfirmShow = false;
  linkCopyMessage = false;
  commentCancel = true;

  linkShareConfirm() {
    this.linkCopyMessage = true;
    this.onSave()
  }

  showDeleteConfirm() {
    this.deleteConfirmShow = true;
  }

  hideDeleteConfirm() {
    this.deleteConfirmShow = false;
  }

  confirmDelete() {
    this.hideDeleteConfirm()
    //blahblah delete document from DB here idk
  }

  dismissComment() {
    this.commentCancel = false;
  }

  pageURL = "http://localhost:4200/view";

  show = true;

  onSave() {
    this.show = false;
  }
  
  loadTextarea () {
    let viewBox = <HTMLInputElement>document.getElementById("viewBox");
    viewBox.value = sessionStorage.getItem("textContent")!;
    //console.log(viewBox.value)
    let arrayValues = viewBox.value.split("\n")
    //console.log("Print these values: " ,arrayValues);
    this.documentLines = arrayValues;
    //return arrayValues;
  }
}

class MessageData {
  username: string;
  icon: string;
  text: string;
  date: number;
  constructor(username:string, icon:string, msg:string, date:number) {
    this.username = username;
    this.icon = icon;
    this.text = msg;
    this.date = date;
  }
}
