import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SignUpComponent } from "src/app/auth/components/sign-up/sign-up.component";

@NgModule({
  imports: [ RouterModule.forChild([
    { path: '', component: SignUpComponent },
    // { path: 'multi-steps', component: MultiStepsComponent },
    // { path: 'free-trial', component: FreeTrialComponent },
    // { path: 'coming-soon', component: ComingSoonComponent },
  ]) ],
  exports: [ RouterModule ],
})
export class SignUpRoutingModule {}
