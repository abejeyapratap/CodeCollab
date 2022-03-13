import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DocumentFiles } from '../documents/documents.model';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/documents/';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {
  private documentsList: DocumentFiles[] = [];
  private documentStatusUpdate = new BehaviorSubject<DocumentFiles[]>([]);

  constructor(private http: HttpClient) {}

  // Fetch documents list from server; send it to all subscriptions in other components
  getDocumentList() {
    this.http
      .get<{ message: string; documents: DocumentFiles[] }>(BACKEND_URL)
      .subscribe((documentsData) => {
        this.documentsList = documentsData.documents;
        this.documentStatusUpdate.next([...this.documentsList]);
      });
  }

  getDocumentsUpdateListener() {
    return this.documentStatusUpdate.asObservable();
  }

  // Fetch document by id for view page
  getDocumentById(documentId: string) {
    return this.http.get<{
      message: string;
      document: string;
      creator: string;
      commentsList: string[]; // TODO - it's actually a list containing comment info
    }>(BACKEND_URL + documentId);
  }

  // Delete document by ID
  deleteDocumentById(documentId: string) {
    return this.http.delete<{ message: string }>(BACKEND_URL + documentId);
  }
}
