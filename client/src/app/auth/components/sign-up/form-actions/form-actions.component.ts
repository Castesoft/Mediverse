import { Component, input, output } from '@angular/core';

@Component({
  host: { class: 'd-flex flex-stack pt-15' },
  selector: 'div[formActions]',
  standalone: true,
  imports: [],
  templateUrl: './form-actions.component.html',
  styleUrl: './form-actions.component.scss'
})
export class FormActionsComponent {
  totalSteps = input.required<number>();
  currentStep = input.required<number>();
  onNextStep = output();
  onPreviousStep = output();
  onSubmit = output();

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
