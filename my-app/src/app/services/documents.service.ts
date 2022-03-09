import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DocumentFiles } from '../documents/documents.model';

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
      .get<{ message: string; documents: DocumentFiles[] }>(
        'http://localhost:3000/api/documents/'
      )
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
    return this.http.get<{ message: string; document: string }>(
      'http://localhost:3000/api/documents/' + documentId
    );
  }

  // Delete document by ID
  // TODO - MUST be user who created document
  deleteDocumentById(documentId: string) {
    return this.http.delete<{ message: string }>(
      'http://localhost:3000/api/documents/' + documentId
    );
  }
}
