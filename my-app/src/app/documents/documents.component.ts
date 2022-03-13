import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DocumentsService } from '../services/documents.service';
import { DocumentFiles } from './documents.model';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css'],
})
export class DocumentsComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  user: User | null;
  /* user: any = {
    displayName: '',
    email: '',
  }; */
  private authStatusSub: Subscription;
  private documentsSub: Subscription;
  documents: DocumentFiles[] = [];

  constructor(
    private authService: AuthService,
    private documentsService: DocumentsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUser();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isUserAuthenticated = isAuthenticated;
        this.user = this.authService.getUser();
        // console.log('Updating user');
        // console.log(this.user);
      });

    this.documentsService.getDocumentList(); // trigger the subscription-update
    this.documentsSub = this.documentsService
      .getDocumentsUpdateListener()
      .subscribe((documentsList) => {
        this.documents = documentsList;
        // console.log(this.documents);
      });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
    this.documentsSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
