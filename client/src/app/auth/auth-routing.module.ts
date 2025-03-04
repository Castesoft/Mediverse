import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SignInModule } from "src/app/auth/sign-in.module";
import { SignUpModule } from "src/app/auth/sign-up.module";

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      redirectTo: 'sign-in',
      pathMatch: 'full'
    },
    {
      path: 'sign-in',
      loadChildren: () => SignInModule,
      title: 'Iniciar sesión en DocHub',
    },
    {
      path: 'sign-up',
      loadChildren: () => SignUpModule,
      title: 'Registrarse en DocHub',
    },
  ]) ],
  exports: [ RouterModule ]
})
export class AuthRoutingModule {}
