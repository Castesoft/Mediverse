import { NgModule } from "@angular/core";
import { SignUpComponent } from "src/app/auth/components/sign-up/sign-up.component";
import { SignUpRoutingModule } from "src/app/auth/sign-up-routing.module";

@NgModule({
  imports: [
    SignUpRoutingModule,
    SignUpComponent,
  ]
})
export class SignUpModule {}
