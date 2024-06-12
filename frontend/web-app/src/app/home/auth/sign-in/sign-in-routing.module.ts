import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BasicComponent } from "./basic.component";
import { NewPasswordComponent } from "./new-password.component";
import { PasswordResetComponent } from "./password-reset.component";

const routes: Routes = [
  { path: 'basic', component: BasicComponent },
  { path: 'password-reset', component: PasswordResetComponent },
  { path: 'new-password', component: NewPasswordComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignInRoutingModule { }
