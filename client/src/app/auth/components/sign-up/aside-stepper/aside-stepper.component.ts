import { CommonModule } from '@angular/common';
import { Component, inject, model, ModelSignal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconsService } from 'src/app/_services/icons.service';
import { AuthFormStep } from "src/app/auth/models/authFormStep";
import { LogoIconComponent } from "src/app/_shared/components/logo-icon/logo-icon.component";

@Component({
  host: { class: 'd-flex flex-column flex-lg-row stepper stepper-pills stepper-dark stepper-column' },
  selector: 'div[asideStepper]',
  templateUrl: './aside-stepper.component.html',
  styleUrl: './aside-stepper.component.scss',
  imports: [ CommonModule, FaIconComponent, LogoIconComponent ],
})
export class AsideStepperComponent {
  readonly icons: IconsService = inject(IconsService);

  currentStep: ModelSignal<number> = model.required<number>();
  steps: ModelSignal<AuthFormStep[]> = model.required();
}
