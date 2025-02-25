import {
  Component,
  effect,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  OutputEmitterRef,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { createId } from '@paralleldrive/cuid2';
import PatientRegisterForm from 'src/app/_models/auth/patientRegister/patientRegisterForm';

@Component({
  host: { class: 'd-flex flex-stack pt-15' },
  selector: 'div[formActions]',
  templateUrl: './form-actions.component.html',
})
export class FormActionsComponent {
  router: Router = inject(Router);

  totalSteps: InputSignal<number> = input.required<number>();
  currentStep: ModelSignal<number> = model.required<number>();
  isSubmittingApi: ModelSignal<boolean> = model.required<boolean>();

  onNextStep: OutputEmitterRef<void> = output();
  onPreviousStep: OutputEmitterRef<void> = output();
  onSubmit: OutputEmitterRef<void> = output();

  patientRegisterForm: ModelSignal<PatientRegisterForm> = model.required();
  accountType: ModelSignal<'patient' | 'doctor'> = model.required();

  formId = signal<string>(createId());

  constructor() {
    effect(() => {
      switch (this.accountType()) {
        case 'doctor':
          break;
        case 'patient':
          this.formId.set(this.patientRegisterForm().id);
          break;
      }
    });
  }

  navigateToLogin() {
    this.router.navigateByUrl('/auth/sign-in').then(() => {});
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
