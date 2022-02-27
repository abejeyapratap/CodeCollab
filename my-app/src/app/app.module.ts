//Specifies the files that the application uses. This file acts as a central hub for the other files in your application.

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DocumentsComponent } from './documents/documents.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateComponent } from './create/create.component';
import { ViewComponent } from './view/view.component';
import {ButtonModule} from 'primeng/button';


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
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'view',
    component: ViewComponent
  },
  { 
    path: '**', 
    component:  PageNotFoundComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    DocumentsComponent,
    HomeComponent,
    PageNotFoundComponent,
    CreateComponent,
    ViewComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    ButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
