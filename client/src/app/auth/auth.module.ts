import { NgModule } from "@angular/core";
import { AuthRoutingModule } from "src/app/auth/auth-routing.module";
import { AuthComponent } from "src/app/auth/auth.component";

@NgModule({
  declarations: [
    AuthComponent
  ],
  imports: [
    AuthRoutingModule,
  ]
})
export class AuthModule {}
