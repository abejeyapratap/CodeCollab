import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  // Use FormData object to store the uploaded filename (that we set manually) and its file
  addDocument(filename: string, codeContent: string): Observable<any> {
    // Create new FormData
    var formData: any = new FormData();
    // Append the filename and contents to FormData
    formData.append('name', filename);
    formData.append('codeContent', codeContent);

    // Post request to API to send to MongoDB database
    return this.http
      .post('http://localhost:3000/api/documents/create', formData, {
        reportProgress: true,
        observe: 'events',
      })
      // Error handling
      .pipe(catchError(this.errorMgmt));
  }

  // Get request to API to retrieve most recent entry from database (using currID from document.js) 
  getDocument(): Observable<any> {
    return this.http
      .get('http://localhost:3000/api/documents/get-document')
      .pipe(catchError(this.errorMgmt));
  }

  // Error handling
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
