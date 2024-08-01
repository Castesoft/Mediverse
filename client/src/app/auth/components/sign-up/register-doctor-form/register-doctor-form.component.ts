import { Component, inject, input } from '@angular/core';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-doctor-form',
  standalone: true,
  imports: [ReactiveFormsModule, AccountSettingsComponent, AccountDetailsComponent, BillingDetailsComponent],
  templateUrl: './register-doctor-form.component.html',
  styleUrl: './register-doctor-form.component.scss'
})
export class RegisterDoctorFormComponent {
  public controlContainer = inject(ControlContainer);
  
  currentStep = input.required<number>();
  submitted = input.required<boolean>();
  myForm!: FormGroup;

  ngOnInit() {
    this.myForm = <FormGroup>this.controlContainer.control;
  }

  get accountSettingsForm(): FormGroup {
    return this.myForm.get('accountSettingsForm') as FormGroup;
  }

  get accountDetailsForm(): FormGroup {
    return this.myForm.get('accountDetailsForm') as FormGroup;
  }

  get billingDetailsForm(): FormGroup {
    return this.myForm.get('billingDetailsForm') as FormGroup;
  }
}
