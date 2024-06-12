import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from './groups/ngx-bootstrap.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordResetFormComponent } from './auth/sign-in/password-reset-form.component';
import { SignInBasicFormComponent } from './auth/sign-in/sign-in-basic-form.component';
import { SignUpBasicFormComponent } from './auth/sign-up/sign-up-basic-form.component';
import { FormControlComponent } from './form-controls/form-control.component';
import { AccountFooterComponent } from '../core/components/account/footer.component';



@NgModule({
  declarations: [
    PasswordResetFormComponent,
    SignInBasicFormComponent,
    SignUpBasicFormComponent,

    FormControlComponent,
    AccountFooterComponent,


  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    NgxBootstrapModule,
  ],
  exports: [
    NgxBootstrapModule,

    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    PasswordResetFormComponent,
    SignInBasicFormComponent,
    SignUpBasicFormComponent,

    FormControlComponent,
    AccountFooterComponent,

  ]
})
export class SharedModule { }
