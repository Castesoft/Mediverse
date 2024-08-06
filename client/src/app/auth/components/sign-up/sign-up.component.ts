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

  currentStep = 4;
  accountType: 'patient' | 'doctor' = 'doctor';
  submitted = false;

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
      firstname             : [ '', [Validators.required, Validators.minLength(3)] ],
      lastname              : [ '', [Validators.required, Validators.minLength(3)] ],
      gender                : [ 'Masculino', [Validators.required] ],
      email                 : [ '', [Validators.required, Validators.pattern(this.accountService.emailPattern)] ],
      phone                 : [ '', [Validators.required, Validators.pattern(this.accountService.phonePattern)] ],
      password              : [ '', [Validators.required, Validators.pattern(this.accountService.passwordPattern)] ],
      confirmpassword       : [ '', [Validators.required] ],
      agreeterms            : [false, [this.accountService.termsAndConditionsValidator] ]
    },{
      validators: [this.accountService.equalFields('password','confirmpassword')]
    } as AbstractControlOptions),
    accountDetailsForm: this.fb.group({
      state                   : [ '', [Validators.required] ],
      city                    : [ '', [Validators.required] ],
      address                 : [ '', [Validators.required] ],
      zipcode                 : [ '', [Validators.required] ],
      specialty               : [ '', [Validators.required] ],
      // services                : [ '', [Validators.required] ],
      certification           : [ '', [Validators.required] ],
      acceptedpaymentmethods  : [ '', [Validators.required] ],
    }),
    billingDetailsForm: this.fb.group({
      sameaddress       : [ true, [Validators.required] ],
      billingstate      : [ '' ],
      billingcity       : [ '' ],
      billingaddress    : [ '' ],
      billingzipcode    : [ '' ],
      nameoncard        : [ '', [Validators.required] ],
      paymentmethod     : [ '' ],
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

      this.accountService.register(this.patientForm.value).subscribe({
        next: _ => this.currentStep++,
      });
    }

    if (this.accountType === 'doctor') {
      if (!this.doctorForm.valid || !this.registerDoctor.billingDetails.stripe || !this.registerDoctor.billingDetails.cardNumber) {
        return;
      }

      const paymentMethod = await this.registerDoctor.billingDetails.stripe?.createPaymentMethod({
        type: 'card',
        card: this.registerDoctor.billingDetails.cardNumber!
      });
      this.doctorForm.get('billingDetailsForm.paymentmethod')?.setValue(paymentMethod?.paymentMethod?.id);
      if (this.doctorForm.get('billingDetailsForm.sameaddress')?.value) {
        this.doctorForm.get('billingDetailsForm.billingstate')?.setValue(this.doctorForm.get('accountDetailsForm.state')?.value);
        this.doctorForm.get('billingDetailsForm.billingcity')?.setValue(this.doctorForm.get('accountDetailsForm.city')?.value);
        this.doctorForm.get('billingDetailsForm.billingaddress')?.setValue(this.doctorForm.get('accountDetailsForm.address')?.value);
        this.doctorForm.get('billingDetailsForm.billingzipcode')?.setValue(this.doctorForm.get('accountDetailsForm.zipcode')?.value);
      }

      console.log(this.doctorForm.value);
    }
  }
}
