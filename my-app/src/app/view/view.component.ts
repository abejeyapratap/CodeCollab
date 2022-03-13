import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
} from '@angular/core';
import { SocketService } from '../services/socket.service';
import { transition, style, animate, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentsService } from '../services/documents.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { User } from '../auth/user.model';

const leaveTrans = transition(':leave', [
  style({
    opacity: 1,
  }),
  animate(
    '7s ease-out',
    style({
      opacity: 0,
    })
  ),
]);

const fadeOut = trigger('fadeOut', [leaveTrans]);

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css'],
  animations: [fadeOut],
})
export class ViewComponent implements OnInit {
  isUserAuthenticated = false;
  user: User | null;
  /* user: any = {
    displayName: "",
    email: ""
  }; */

  documentId: string;
  creatorId: string;
  messages: MessageData[] = [];
  comments: CommentData[] = [];
  newMessage = '';
  myDisplayName: string = '';

  // documentLines: string[] = ['function foo() {', '\treturn 0;', '}'];
  documentLines: string[] = [];
  commentingLine: HTMLDivElement;
  commentLineNum: number;
  newComment = '';

  private authStatusSub: Subscription;

  constructor(
    private sockets: SocketService,
    private documentsService: DocumentsService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  @ViewChildren('codeLines') codeLines!: QueryList<ElementRef>;

  ngOnInit() {
    this.user = this.authService.getUser();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
        this.user = this.authService.getUser();
      });

    // listen to changes in route URL & render correct file
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('documentId')) {
        this.router.navigateByUrl('/');
      }

      // Initialize document file
      this.documentId = paramMap.get('documentId')!;
      this.documentsService
        .getDocumentById(this.documentId)
        .subscribe((documentContent) => {
          this.documentLines = documentContent.document.split('\n');
          this.creatorId = documentContent.creator;
          console.log(documentContent.commentsList); // TODO render the saved comments
        });

      this.sockets.viewDocument(this.documentId);
    });

    // Sockets initialization
    this.sockets.onNewComment().subscribe((data) => {
      this.addComment(data[0], data[1], data[2], data[3], data[4]);
    });
    this.sockets.onNewChatMessage().subscribe((data) => {
      this.addChatMessage(data[0], data[1], data[2], data[3]);
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.sockets.endViewingDocument();
  }

  addChatMessage(
    username: string,
    icon: string,
    msg: string,
    date: number
  ): void {
    this.messages.push(new MessageData(username, icon, msg, date));
  }

  addComment(
    username: string,
    icon: string,
    msg: string,
    date: number,
    line: number
  ) {
    this.comments.push(
      new CommentData(username, icon, `Line ${line + 1}: ${msg}`, date, line)
    );
    this.comments.sort((a, b) => {
      return a.line - b.line;
    });
  }

  sendChatMessage() {
    this.sockets.sendChatMessage(this.newMessage);
    this.newMessage = '';
  }

  postComment() {
    if (this.newComment.trim() == '') {
      this.dismissComment();
      this.newComment = '';
      return;
    }
    this.sockets.postComment(this.newComment, this.commentLineNum);
    this.newComment = '';
    this.dismissComment();
  }

  deleteConfirmShow = false;
  linkCopyMessage = false;
  commentCancel = false;

  startComment(line: number, divElement: HTMLDivElement) {
    if (this.commentingLine != null)
      this.commentingLine.classList.remove('commentingLine');

    divElement.classList.add('commentingLine');
    this.commentingLine = divElement;
    this.commentLineNum = line;
    this.commentCancel = true;
  }

  onCommentHover(comment: CommentData, enter: boolean) {
    // console.log(this.codeLines.first.classList);
    if (enter) {
      this.codeLines
        .get(comment.line)
        ?.nativeElement.classList.add('commentHover');
    } else {
      this.codeLines
        .get(comment.line)
        ?.nativeElement.classList.remove('commentHover');
    }
  }

  linkShareConfirm() {
    this.linkCopyMessage = true;
    this.onSave();
  }

  showDeleteConfirm() {
    this.deleteConfirmShow = true;
  }

  hideDeleteConfirm() {
    this.deleteConfirmShow = false;
  }

  confirmDelete() {
    this.hideDeleteConfirm();
    this.documentsService
      .deleteDocumentById(this.documentId)
      .subscribe((response) => {
        if (response.message === 'Success') {
          this.router.navigateByUrl('/documents');
        } else {
          console.log('Failed to delete.');
        }
      });
  }

  dismissComment() {
    if (this.commentingLine != null)
      this.commentingLine.classList.remove('commentingLine');
    this.commentCancel = false;
  }

  pageURL = 'http://localhost:4200' + this.router.url;

  show = true;

  onSave() {
    this.show = false;
  }

  getDisplayName(userID: string) {
    // TODO / TEMP
    return 'username';
  }

  onLogin() {
    window.location.href = 'http://localhost:3000/api/auth/google';
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }

  /* loadTextarea() {
    let viewBox = <HTMLInputElement>document.getElementById('viewBox');
    viewBox.value = sessionStorage.getItem('textContent')!;
    let arrayValues = viewBox.value.split('\n');
    // this.documentLines = arrayValues; REMOVED FOR TESTING
  } */
}

class MessageData {
  username: string;
  icon: string;
  text: string;
  date: number;
  constructor(username: string, icon: string, msg: string, date: number) {
    this.username = username;
    this.icon = icon;
    this.text = msg;
    this.date = date;
  }
}

class CommentData {
  username: string;
  icon: string;
  text: string;
  date: number;
  line: number;
  constructor(
    username: string,
    icon: string,
    msg: string,
    date: number,
    line: number
  ) {
    this.username = username;
    this.icon = icon;
    this.text = msg;
    this.date = date;
    this.line = line;
  }
}
