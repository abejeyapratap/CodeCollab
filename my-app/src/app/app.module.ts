//Specifies the files that the application uses. This file acts as a central hub for the other files in your application.

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DocumentsComponent } from './documents/documents.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '', redirectTo: '/home', pathMatch: 'full',
  
  },
  {
    path: 'documents',
    component: DocumentsComponent
  },
  { path: '**', component:  PageNotFoundComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    DocumentsComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
