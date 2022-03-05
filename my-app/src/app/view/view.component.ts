import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(private sockets:SocketService) { }

  ngOnInit(): void {
    this.sockets.onNewChatMessage().subscribe((data) => { this.addChatMessage(data[0], data[1], data[2], data[3]) })
  }

  addChatMessage(username:string, icon:string, msg:string, date:number): void {
    console.log(msg);
  }

}
