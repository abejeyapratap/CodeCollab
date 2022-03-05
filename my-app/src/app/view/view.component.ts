import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(private sockets:SocketService) { }

  messages: MessageData[] = [];
  newMessage = '';
  myDisplayName: string = '';

  ngOnInit(): void {
    this.sockets.onNewChatMessage().subscribe((data) => { this.addChatMessage(data[0], data[1], data[2], data[3]) })
  }

  addChatMessage(username: string, icon: string, msg: string, date: number): void {
    this.messages.push(new MessageData(username, icon, msg, date));
  }

  async sendChatMessage() {

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
