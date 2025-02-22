import { NgModule } from "@angular/core";
import { NewPasswordComponent } from "src/app/auth/components/new-password/new-password.component";
import { SignInRoutingModule } from "src/app/auth/sign-in-routing.module";

@NgModule({
  imports: [
    SignInRoutingModule,
    NewPasswordComponent,
  ]
})
export class SignInModule {}
