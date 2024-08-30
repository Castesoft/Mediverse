import { Component, inject, ViewChild } from '@angular/core';
import { AsideStepperComponent } from './aside-stepper/aside-stepper.component';
import { BottomLinksComponent } from '../bottom-links.component';
import { FormActionsComponent } from './form-actions/form-actions.component';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AccoutTypeSelectorComponent } from "./accout-type-selector/accout-type-selector.component";
import { RegisterPatientFormComponent } from "./register-patient-form/register-patient-form.component";
import { RegisterDoctorFormComponent } from './register-doctor-form/register-doctor-form.component';
import { AccountService } from 'src/app/_services/account.service';
import { AccountCompletedComponent } from './account-completed/account-completed.component';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, AsideStepperComponent, FormActionsComponent, BottomLinksComponent, AccoutTypeSelectorComponent, RegisterPatientFormComponent, RegisterDoctorFormComponent, AccountCompletedComponent],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  private accountService = inject(AccountService);
  fb = inject(FormBuilder);
  @ViewChild('registerDoctor') registerDoctor!: RegisterDoctorFormComponent;

  currentStep = 1;
  accountType: 'patient' | 'doctor' = 'patient';
  submitted = false;
  isSubmittingApi = false;

  steps = [
    { number: 1, title: 'Tipo de cuenta', subtitle: 'Selecciona tu tipo de cuenta' }
  ];

  stepsPatient = [
    { number: 1, title: 'Tipo de cuenta', subtitle: 'Selecciona tu tipo de cuenta' },
    { number: 2, title: 'Ajustes de Cuenta', subtitle: 'Configure su cuenta' },
    { number: 3, title: 'Completada', subtitle: 'Su cuenta ha sido creada' },
  ];

  stepsDoctor = [
    { number: 1, title: 'Tipo de cuenta', subtitle: 'Selecciona tu tipo de cuenta' },
    { number: 2, title: 'Ajustes de Cuenta', subtitle: 'Configure su cuenta' },
    { number: 3, title: 'Detalles de Cuenta', subtitle: 'Ingrese los detalles de cuenta' },
    { number: 4, title: 'Facturación', subtitle: 'Datos de facturación' },
    { number: 5, title: 'Completada', subtitle: 'Su cuenta ha sido creada' },
  ]

  patientForm: FormGroup = this.fb.group({
    firstname            : [ '', [Validators.required, Validators.minLength(3)] ],
    lastname             : [ '', [Validators.required, Validators.minLength(3)] ],
    gender                : [ 'Masculino', [Validators.required] ],
    email                 : [ '', [Validators.required, Validators.pattern(this.accountService.emailPattern)] ],
    password              : [ '', [Validators.required, Validators.pattern(this.accountService.passwordPattern)] ],
    confirmpassword               : [ '', [Validators.required] ],
    agreeterms  : [false, [this.accountService.termsAndConditionsValidator] ]
  },{
    validators: [this.accountService.equalFields('password','confirmpassword')]
  } as AbstractControlOptions);

  doctorForm: FormGroup = this.fb.group({
    accountSettingsForm: this.fb.group({
      FirstName             : [ '', [Validators.required, Validators.minLength(3)] ],
      LastName              : [ '', [Validators.required, Validators.minLength(3)] ],
      Gender                : [ 'Masculino', [Validators.required] ],
      Email                 : [ '', [Validators.required, Validators.pattern(this.accountService.emailPattern)] ],
      Phone                 : [ '', [Validators.required, Validators.pattern(this.accountService.phonePattern)] ],
      Password              : [ '', [Validators.required, Validators.pattern(this.accountService.passwordPattern)] ],
      ConfirmPassword       : [ '', [Validators.required] ],
      AgreeTerms            : [false, [this.accountService.termsAndConditionsValidator] ]
    },{
      validators: [this.accountService.equalFields('Password','ConfirmPassword')]
    } as AbstractControlOptions),
    accountDetailsForm: this.fb.group({
      State                           : [ '', [Validators.required] ],
      City                            : [ '', [Validators.required] ],
      Street                         : [ '', [Validators.required] ],
      Zipcode                         : [ '', [Validators.required] ],
      SpecialtyId                     : [ '', [Validators.required] ],
      // services                        : [ '', [Validators.required] ],
      certification                   : [ '', [Validators.required] ],
      file                            : [ '' ],
      AcceptedPaymentMethods          : [ '', [Validators.required] ],
      RequireAnticipatedCardPayments  : [ false ],
    }),
    billingDetailsForm: this.fb.group({
      SameAddress             : [ true, [Validators.required] ],
      BillingState            : [ '' ],
      BillingCity             : [ '' ],
      BillingAddress          : [ '' ],
      BillingZipcode          : [ '' ],
      DisplayName             : [ '', [Validators.required] ],
      StripePaymentMethodId   : [ '' ],
      Last4                   : [ '' ],
      ExpirationMonth         : [ '' ],
      ExpirationYear          : [ '' ],
      Brand                   : [ '' ],
      Country                 : [ '' ],
    })
  });

  get formSteps() {
    if (this.currentStep === 1) return this.steps;
    if (this.accountType === 'patient') return this.stepsPatient;
    return this.stepsDoctor;
  }

  selectAccountType(type: string) {
    this.accountType = type as "patient" | "doctor";
  }

  onNextStep() {
    if (this.accountType === 'doctor') {
      if (this.currentStep === 2) {
        this.submitted = true;
        if (!this.doctorForm.get('accountSettingsForm')?.valid) {
          return;
        }
        this.submitted = false;
      } else if (this.currentStep == 3) {
        this.submitted = true;
        if (!this.doctorForm.get('accountDetailsForm')?.valid) {
          return;
        }
        this.submitted = false;
      }
    }

    this.currentStep = this.currentStep + 1;
  }

  onPreviousStep() {
    this.submitted = false;
    this.currentStep = this.currentStep - 1
  }

  async onSubmit() {
    this.submitted = true;

    if (this.accountType === 'patient') {
      if (!this.patientForm.valid) {
        return;
      }
      this.isSubmittingApi = true;

      this.accountService.register(this.patientForm.value).subscribe({
        next: _ => {
          this.currentStep++;
          this.isSubmittingApi = false;
        },
      });
    }

    if (this.accountType === 'doctor') {
      if (!this.doctorForm.valid || !this.registerDoctor.billingDetails.stripe || !this.registerDoctor.billingDetails.cardNumber) {
        return;
      }
      this.isSubmittingApi = true;

      const paymentMethod = await this.registerDoctor.billingDetails.stripe?.createPaymentMethod({
        type: 'card',
        card: this.registerDoctor.billingDetails.cardNumber!
      });
      this.doctorForm.get('billingDetailsForm.StripePaymentMethodId')?.setValue(paymentMethod?.paymentMethod?.id);
      this.doctorForm.get('billingDetailsForm.Last4')?.setValue(paymentMethod?.paymentMethod?.card?.last4);
      this.doctorForm.get('billingDetailsForm.ExpirationMonth')?.setValue(paymentMethod?.paymentMethod?.card?.exp_month);
      this.doctorForm.get('billingDetailsForm.ExpirationYear')?.setValue(paymentMethod?.paymentMethod?.card?.exp_year);
      this.doctorForm.get('billingDetailsForm.Brand')?.setValue(paymentMethod?.paymentMethod?.card?.brand);
      this.doctorForm.get('billingDetailsForm.Country')?.setValue(paymentMethod?.paymentMethod?.card?.country);
      if (this.doctorForm.get('billingDetailsForm.SameAddress')?.value) {
        this.doctorForm.get('billingDetailsForm.BillingState')?.setValue(this.doctorForm.get('accountDetailsForm.State')?.value);
        this.doctorForm.get('billingDetailsForm.BillingCity')?.setValue(this.doctorForm.get('accountDetailsForm.City')?.value);
        this.doctorForm.get('billingDetailsForm.BillingAddress')?.setValue(this.doctorForm.get('accountDetailsForm.Street')?.value);
        this.doctorForm.get('billingDetailsForm.BillingZipcode')?.setValue(this.doctorForm.get('accountDetailsForm.Zipcode')?.value);
      }

      const jsonData = JSON.stringify({
        ...this.doctorForm.value.accountSettingsForm,
        ...this.doctorForm.value.accountDetailsForm,
        ...this.doctorForm.value.billingDetailsForm
      });

      const formData = new FormData();

      formData.append('json', jsonData);
      formData.append('file', this.doctorForm.get('accountDetailsForm.file')?.value);

      this.accountService.registerDoctor(formData).subscribe({
        next: _ => {
          this.currentStep++;
          this.isSubmittingApi = false;
        },
      });
    }
  }
}
