import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SignInModule } from "src/app/auth/sign-in.module";
import { SignUpModule } from "src/app/auth/sign-up.module";
import { VerifyEmailComponent } from "./components/verify-email/verify-email.component";
import { anonymousGuard } from "src/app/_guards/anonymous.guard";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'sign-in',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadChildren: () => SignInModule,
    title: 'Iniciar sesión en DocHub',
    canActivate: [ anonymousGuard ]
  },
  {
    path: 'sign-up',
    loadChildren: () => SignUpModule,
    title: 'Registrarse en DocHub',
    canActivate: [ anonymousGuard ]
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
    title: 'Verificar Correo - DocHub'
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule {}
