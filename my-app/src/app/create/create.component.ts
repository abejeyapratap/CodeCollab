import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileUploadService } from '../services/file-upload.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  progress: number = 0;

  constructor(
    public fb: FormBuilder,
    public fileUploadService: FileUploadService
  ) {
    this.form = this.fb.group({
      name: [''],
      codeContent: [null],
    });
  }
  
  ngOnInit(): void {}


  uploadFile(event: any) {
    sessionStorage.removeItem("textContent");
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({
      codeContent: file,
    });
    this.form.get('codeContent')!.updateValueAndValidity();
  }

  viewFile(){ 
    let box = <HTMLInputElement>document.getElementById("textbox"); // cast to HTMLelement due to typesafe
    this.fileUploadService.getUser().subscribe(
      result => {
        box.value = result.results; 
        sessionStorage.setItem("textContent", result.results)
      });
    //this.fileUploadService.getUser().subscribe(result => sessionStorage.setItem("textContent", result.results));

  }

  submitUser() {
    this.fileUploadService
      .addUser(this.form.value.name, this.form.value.codeContent)
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
            console.log('User successfully created!', event.body);
            setTimeout(() => {
              this.progress = 0;
            }, 1500);
        }
      });
  }

}
