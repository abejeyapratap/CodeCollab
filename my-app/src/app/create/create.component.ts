import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from '../services/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  progress: number = 0;

  constructor(
    public fb: FormBuilder,
    public fileUploadService: FileUploadService
  ) {
    // Create Reactive form to hold key pair values
    this.form = this.fb.group({
      // Set name of file to blank (we enter this in manually)
      name: [''],
      // Set current file selected as null
      codeContent: [null],
    });
  }

  ngOnInit() {}

  // Occurs when clicking "Choose File..." button
  uploadFile(event: any) {
    // Removes previous sessionStorage
    sessionStorage.removeItem("textContent");
    // Retrieves the first file selected
    const file = (event.target as HTMLInputElement).files![0];
    // patchValue is used to update a part of a form
    // We set the file content of our key "codeContent" to whichever was selected
    // in the dropdown menu
    this.form.patchValue({
      codeContent: file,
    });
    // Set codeContent status to valid
    // This event will trigger the form to submit (and therefore call submitFile() below)
    this.form.get('codeContent')!.updateValueAndValidity();
  }

  // Occurs when clicking "View" button
  // Right now this works by putting the text in the invisible textarea on the create page
  viewFile(){ 
    let box = <HTMLInputElement>document.getElementById("textbox"); // cast to HTMLelement due to typesafe
    // Call getDocument from services to make a get request
    this.fileUploadService.getDocument().subscribe(
      result => {
        // Set the value of the textarea on the create page to the text
        // returned by the get request
        box.value = result.results;
        // Temp solution right now: use a sessionStorage to transfer contents to view page 
        sessionStorage.setItem("textContent", result.results)
      });
  }

  // Called once the form has been submitted (uploadFile() has taken place)
  submitFile() {
    this.fileUploadService
      // Sends post request to API using the name of the file we manually input, 
      // and the file that was selected
      .addDocument(this.form.value.name, this.form.value.codeContent)
      // Print progress in the console
      .subscribe((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total!) * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('Document successfully created!', event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
        }
      });
  }
}
