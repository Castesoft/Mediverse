import { CommonModule } from '@angular/common';
import { Component, inject, model } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconsService } from 'src/app/_services/icons.service';

@Component({
  host: { class: 'd-flex flex-column flex-lg-row stepper stepper-pills stepper-dark stepper-column' },
  selector: 'div[asideStepper]',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  templateUrl: './aside-stepper.component.html',
  styleUrl: './aside-stepper.component.scss'
})
export class AsideStepperComponent {
  icons = inject(IconsService);

  currentStep = model.required<number>();
  steps = model.required<{number: number, title: string, subtitle: string}[]>();
}
