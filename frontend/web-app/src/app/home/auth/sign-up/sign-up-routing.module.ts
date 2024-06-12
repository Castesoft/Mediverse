import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BasicComponent } from "./basic.component";
import { ComingSoonComponent } from "./coming-soon.component";
import { FreeTrialComponent } from "./free-trial.component";
import { MultiStepsComponent } from "./multi-steps.component";

const routes: Routes = [
  { path: 'basic', component: BasicComponent },
  { path: 'multi-steps', component: MultiStepsComponent },
  { path: 'free-trial', component: FreeTrialComponent },
  { path: 'coming-soon', component: ComingSoonComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignUpRoutingModule {}
