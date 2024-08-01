import { Component, inject } from '@angular/core';
import { AsideStepperComponent } from './aside-stepper/aside-stepper.component';
import { BottomLinksComponent } from '../bottom-links.component';
import { FormActionsComponent } from './form-actions/form-actions.component';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  currentStep = 1;
  accountType: 'patient' | 'doctor' = 'patient';
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
    first_name            : [ '', [Validators.required, Validators.minLength(3)] ],
    last_name             : [ '', [Validators.required, Validators.minLength(3)] ],
    email                 : [ '', [Validators.required, Validators.pattern(this.accountService.emailPattern)] ],
    password              : [ '', [Validators.required, Validators.pattern(this.accountService.passwordPattern)] ],
    confirm               : [ '', [Validators.required] ],
    terms_and_conditions  : [false, [this.accountService.termsAndConditionsValidator] ]
  },{
    validators: [this.accountService.equalFields('password','confirm')]
  } as AbstractControlOptions);

  doctorForm: FormGroup = this.fb.group({
    accountSettingsForm: this.fb.group({
      first_name            : [ '', [Validators.required, Validators.minLength(3)] ],
      last_name             : [ '', [Validators.required, Validators.minLength(3)] ],
      email                 : [ '', [Validators.required, Validators.pattern(this.accountService.emailPattern)] ],
      phone                 : [ '', [Validators.required, Validators.pattern(this.accountService.phonePattern)] ],
      password              : [ '', [Validators.required, Validators.pattern(this.accountService.passwordPattern)] ],
      confirm               : [ '', [Validators.required] ],
      terms_and_conditions  : [false, [this.accountService.termsAndConditionsValidator] ]
    },{
      validators: [this.accountService.equalFields('password','confirm')]
    } as AbstractControlOptions),
    accountDetailsForm: this.fb.group({
      full_name   : [ '', [Validators.required, Validators.minLength(3)] ],
    }),
    billingForm: this.fb.group({
      full_name   : [ '', [Validators.required, Validators.minLength(3)] ],
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
        // Validate second form
      }
    }

    this.currentStep = this.currentStep + 1;
  }

  onPreviousStep() {
    this.submitted = false;
    this.currentStep = this.currentStep - 1
  }

  onSubmit() {
    this.submitted = true;

    if (this.accountType === 'patient') {
      console.log(this.patientForm.controls);
      if (!this.patientForm.valid) {
        return;
      }

      // Register patient
    }

    if (this.accountType === 'doctor') {
      console.log(this.doctorForm.controls);
      if (!this.doctorForm.valid) {
        return;
      }

      // Register doctor
    }

    this.currentStep++;
  }
}
