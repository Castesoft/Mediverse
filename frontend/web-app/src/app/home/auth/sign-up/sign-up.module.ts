import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MultiStepsComponent } from './multi-steps.component';
import { FreeTrialComponent } from './free-trial.component';
import { ComingSoonComponent } from './coming-soon.component';
import { BasicComponent } from "./basic.component";
import { CoreModule } from "../../../core/core.module";
import { SharedModule } from "../../../shared/shared.module";
import { SignUpRoutingModule } from "./sign-up-routing.module";

@NgModule({
  declarations: [
    BasicComponent,
    MultiStepsComponent,
    FreeTrialComponent,
    ComingSoonComponent
  ],
  imports: [
    CommonModule,
    SignUpRoutingModule,
    CoreModule,
    SharedModule,
  ],
})
export class SignUpModule {}
