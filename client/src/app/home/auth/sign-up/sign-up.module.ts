import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MultiStepsComponent } from './multi-steps.component';
import { FreeTrialComponent } from './free-trial.component';
import { ComingSoonComponent } from './coming-soon.component';
import { BasicComponent } from "./basic.component";
import { SignUpRoutingModule } from "./sign-up-routing.module";

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    BasicComponent,
    MultiStepsComponent,
    FreeTrialComponent,
    ComingSoonComponent
  ],

})
export class SignUpModule {}
