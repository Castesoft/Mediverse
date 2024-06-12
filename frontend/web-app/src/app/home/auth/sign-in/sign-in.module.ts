import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicComponent } from './basic.component';
import { PasswordResetComponent } from './password-reset.component';
import { NewPasswordComponent } from './new-password.component';
import { CoreModule } from '../../../core/core.module';
import { SharedModule } from '../../../shared/shared.module';
import { SignInRoutingModule } from './sign-in-routing.module';

@NgModule({
  declarations: [
    BasicComponent,
    PasswordResetComponent,
    NewPasswordComponent,
  ],
  imports: [
    CommonModule,
    SignInRoutingModule,
    CoreModule,
    SharedModule,
  ]
})
export class SignInModule { }
