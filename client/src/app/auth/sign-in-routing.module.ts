import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NewPasswordComponent } from "src/app/auth/components/new-password/new-password.component";
import { SignInBasicComponent } from "src/app/auth/components/sign-in-basic/sign-in-basic.component";
import { PasswordResetComponent } from "src/app/auth/components/password-reset/password-reset.component";

@NgModule({
  imports: [ RouterModule.forChild([
    { path: '', component: SignInBasicComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: 'new-password', component: NewPasswordComponent },
  ]) ],
  exports: [ RouterModule ],
})
export class SignInRoutingModule {}
