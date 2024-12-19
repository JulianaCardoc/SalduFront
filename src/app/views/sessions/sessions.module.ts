import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SigninComponent } from './signin/signin.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
];

@NgModule({
  declarations: [
    SigninComponent,    
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule
  ]
})
export class SessionsModule{}