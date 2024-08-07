import { Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  host: { class: 'd-flex flex-stack pt-15' },
  selector: 'div[formActions]',
  standalone: true,
  imports: [],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.scss'
})
export class FormActionsComponent {
  router = inject(Router);

  totalSteps = input.required<number>();
  currentStep = input.required<number>();
  isSubmittingApi = input.required<boolean>();
  onNextStep = output();
  onPreviousStep = output();
  onSubmit = output();

  navigateToLogin() {
    this.router.navigateByUrl('/auth/sign-in');
  }

  nextStep() {
    this.onNextStep.emit();
  }

  previousStep() {
    this.onPreviousStep.emit();
  }

  submit() {
    this.onSubmit.emit();
  }
}
