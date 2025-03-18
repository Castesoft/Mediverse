import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { OnboardingCompleteComponent } from "src/app/onboarding/onboarding-complete/onboarding-complete.component";
import { OnboardingRetryComponent } from "src/app/onboarding/onboarding-retry/onboarding-retry.component";
import { OnboardingComponent } from "src/app/onboarding/onboarding.component";

const routes: Routes = [
  {
    path: '',
    component: OnboardingComponent,
    children: [
      {
        path: 'completado',
        component: OnboardingCompleteComponent,
        title: 'DocHub | Proceso Terminado',
        data: { breadcrumb: 'Proceso Terminado' },
      },
      {
        path: 'reintentar',
        component: OnboardingRetryComponent,
        title: 'DocHub | Favor de Reintentar',
        data: { breadcrumb: 'Favor de Reintentar' },
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class OnboardingRoutingModule {}
