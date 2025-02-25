import { Component, inject, model, ModelSignal, output, OutputEmitterRef, ViewChild } from '@angular/core';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AccountDetailsComponent } from './account-details/account-details.component';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { ControlContainer, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register-doctor-form',
  templateUrl: './register-doctor-form.component.html',
  imports: [
    ReactiveFormsModule,
    AccountSettingsComponent,
    AccountDetailsComponent,
    BillingDetailsComponent
  ],
})
export class RegisterDoctorFormComponent {
  public controlContainer: ControlContainer = inject(ControlContainer);
  @ViewChild('billingDetails') billingDetails!: BillingDetailsComponent;
  @ViewChild('accountDetails') accountDetails!: AccountDetailsComponent;

  onSubmit: OutputEmitterRef<void> = output();

  currentStep: ModelSignal<number> = model.required<number>();
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
