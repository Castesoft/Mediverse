import { Component, effect, inject, input, model, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { createId } from '@paralleldrive/cuid2';
import PatientRegisterForm from 'src/app/_models/auth/patientRegister/patientRegisterForm';

@Component({
  host: { class: 'd-flex flex-stack pt-15' },
  selector: 'div[formActions]',
  standalone: true,
  imports: [],
  templateUrl: './form-actions.component.html',
})
export class FormActionsComponent {
  router = inject(Router);

  totalSteps = input.required<number>();
  currentStep = model.required<number>();
  isSubmittingApi = model.required<boolean>();
  onNextStep = output();
  onPreviousStep = output();
  onSubmit = output();

  patientRegisterForm = model.required<PatientRegisterForm>();
  accountType = model.required<'patient' | 'doctor'>();

  formId = signal<string>(createId());

  constructor() {
    effect(() => {
      if (this.accountType() === 'doctor') {

      } else if (this.accountType() === 'patient') {
        this.formId.set(this.patientRegisterForm().id);
      }
    });
  }

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
