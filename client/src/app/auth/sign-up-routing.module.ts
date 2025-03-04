import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SignUpComponent } from "src/app/auth/components/sign-up/sign-up.component";

@NgModule({
  imports: [ RouterModule.forChild([
    {
      path: '',
      component: SignUpComponent
    },
  ]) ],
  exports: [ RouterModule ],
})
export class SignUpRoutingModule {}
