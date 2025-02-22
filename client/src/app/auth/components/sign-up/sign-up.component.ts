import { Component, effect, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { AsideStepperComponent } from './aside-stepper/aside-stepper.component';
import { BottomLinksComponent } from '../bottom-links.component';
import { FormActionsComponent } from './form-actions/form-actions.component';
import {
  AbstractControlOptions,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AccoutTypeSelectorComponent } from "./accout-type-selector/accout-type-selector.component";
import { RegisterPatientFormComponent } from "./register-patient-form/register-patient-form.component";
import { RegisterDoctorFormComponent } from './register-doctor-form/register-doctor-form.component';
import { AccountService } from 'src/app/_services/account.service';
import { AccountCompletedComponent } from './account-completed/account-completed.component';
import PatientRegisterForm from 'src/app/_models/auth/patientRegister/patientRegisterForm';
import { ActivatedRoute, Router } from '@angular/router';
import { ValidationService } from 'src/app/_services/validation.service';
import { createId } from '@paralleldrive/cuid2';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { PaymentMethodResult } from "@stripe/stripe-js";
import { Account } from "src/app/_models/account/account";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AsideStepperComponent,
    FormActionsComponent,
    BottomLinksComponent,
    AccoutTypeSelectorComponent,
    RegisterPatientFormComponent,
    RegisterDoctorFormComponent,
    AccountCompletedComponent,
    Forms2Module,
  ],
})
export class SignUpComponent {
  private readonly validationService: ValidationService = inject(ValidationService);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  readonly fb: FormBuilder = inject(FormBuilder);
  @ViewChild('registerDoctor') registerDoctor!: RegisterDoctorFormComponent;

  accountType: WritableSignal<'patient' | 'doctor'> = signal('patient');
  isSubmittingApi: WritableSignal<boolean> = signal(false);
  formId: WritableSignal<string> = signal(createId());
  currentStep: WritableSignal<number> = signal(1);

  firstName?: string;

  constructor() {
    const type: string = this.route.snapshot.queryParams['type'];

    if (type === 'doctor') {
      this.accountType.set('doctor');
    } else if (type === 'patient') {
      this.accountType.set('patient');
      this.formId.set(this.patientRegisterForm().id);
    }

    const step: number | undefined = this.route.snapshot.queryParams['step'];

    if (step) {
      this.currentStep.set(+step);
    }

    effect(() => {
      const patientFormCopy = this.patientRegisterForm();
      patientFormCopy.validation = this.validationService.active();
      this.patientRegisterForm.set(patientFormCopy);

      if (this.accountType() === 'doctor') {
        this.router.navigate([], { queryParams: { type: 'doctor' }, queryParamsHandling: 'merge' }).then(() => {});
      } else if (this.accountType() === 'patient') {
        this.router.navigate([], { queryParams: { type: 'patient' }, queryParamsHandling: 'merge' }).then(() => {});
        this.formId.set(this.patientRegisterForm().id);
      }

      this.router.navigate([], {
        queryParams: { step: this.currentStep() },
        queryParamsHandling: 'merge'
      }).then(() => {});

    });
  }

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

  patientRegisterForm = signal(new PatientRegisterForm());

  doctorForm: FormGroup = this.fb.group({
    accountSettingsForm: this.fb.group({
      FirstName: [ '', [ Validators.required, Validators.minLength(3) ] ],
      LastName: [ '', [ Validators.required, Validators.minLength(3) ] ],
      Gender: [ 'Masculino', [ Validators.required ] ],
      Email: [ '', [ Validators.required, Validators.pattern(this.accountService.emailPattern) ] ],
      Phone: [ '', [ Validators.required, Validators.pattern(this.accountService.phonePattern) ] ],
      Password: [ '', [ Validators.required, Validators.pattern(this.accountService.passwordPattern) ] ],
      ConfirmPassword: [ '', [ Validators.required ] ],
      AgreeTerms: [ false, [ this.accountService.termsAndConditionsValidator ] ]
    }, {
      validators: [ this.accountService.equalFields('Password', 'ConfirmPassword') ]
    } as AbstractControlOptions),
    accountDetailsForm: this.fb.group({
      State: [ '', [ Validators.required ] ],
      City: [ '', [ Validators.required ] ],
      Street: [ '', [ Validators.required ] ],
      Zipcode: [ '', [ Validators.required ] ],
      Neighborhood: [ '', [ Validators.required ] ],
      ExteriorNumber: [ '', [ Validators.required ] ],
      InteriorNumber: [ '' ],
      SpecialtyId: [ '', [ Validators.required ] ],
      certification: [ '', [ Validators.required ] ],
      file: [ '' ],
      AcceptedPaymentMethods: [ '', [ Validators.required ] ],
      RequireAnticipatedCardPayments: [ false ],
    }),
    billingDetailsForm: this.fb.group({
      SameAddress: [ true, [ Validators.required ] ],
      BillingState: [ '' ],
      BillingCity: [ '' ],
      BillingAddress: [ '' ],
      BillingZipcode: [ '' ],
      BillingNeighborhood: [ '' ],
      BillingExteriorNumber: [ '' ],
      BillingInteriorNumber: [ '' ],
      DisplayName: [ '', [ Validators.required ] ],
      StripePaymentMethodId: [ '' ],
      Last4: [ '' ],
      ExpirationMonth: [ '' ],
      ExpirationYear: [ '' ],
      Brand: [ '' ],
      Country: [ '' ],
    })
  });

  get formSteps() {
    if (this.currentStep() === 1) return this.steps;
    if (this.accountType() === 'patient') return this.stepsPatient;
    return this.stepsDoctor;
  }

  selectAccountType(type: string) {
    this.accountType.set(type as "patient" | "doctor");
  }

  onNextStep() {
    if (this.accountType() === 'doctor') {
      if (this.currentStep() === 2) {
        if (!this.doctorForm.get('accountSettingsForm')?.valid) {
          return;
        }
      } else if (this.currentStep() === 3) {
        if (!this.doctorForm.get('accountDetailsForm')?.valid) {
          return;
        }
      }
    }

    this.currentStep.set(this.currentStep() + 1);
  }

  onPreviousStep() {
    this.currentStep.set(this.currentStep() - 1);
  }

  submitPatientRegisterForm() {
    this.patientRegisterForm().submitted = true;
    this.isSubmittingApi.set(true);

    this.accountService.register(this.patientRegisterForm().getRawValue()).subscribe({
      next: (account: Account) => {
        this.firstName = account.firstName || undefined;
        this.currentStep.set(this.currentStep() + 1);
        this.isSubmittingApi.set(false);
      },
      error: (error: BadRequest) => {
        this.patientRegisterForm().error = error;
        this.isSubmittingApi.set(false);
      }
    });
  }

  async submitDoctorRegisterForm() {
    if (!this.doctorForm.valid || !this.registerDoctor.billingDetails.stripe || !this.registerDoctor.billingDetails.cardNumber) {
      return;
    }

    this.isSubmittingApi.set(true);

    const paymentMethod: PaymentMethodResult = await this.registerDoctor.billingDetails.stripe?.createPaymentMethod({
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
      this.doctorForm.get('billingDetailsForm.BillingNeighborhood')?.setValue(this.doctorForm.get('accountDetailsForm.Neighborhood')?.value);
      this.doctorForm.get('billingDetailsForm.BillingExteriorNumber')?.setValue(this.doctorForm.get('accountDetailsForm.ExteriorNumber')?.value);
      this.doctorForm.get('billingDetailsForm.BillingInteriorNumber')?.setValue(this.doctorForm.get('accountDetailsForm.InteriorNumber')?.value);
    }

    const jsonData: string = JSON.stringify({
      ...this.doctorForm.value.accountSettingsForm,
      ...this.doctorForm.value.accountDetailsForm,
      ...this.doctorForm.value.billingDetailsForm
    });

    const formData = new FormData();

    formData.append('json', jsonData);
    formData.append('file', this.doctorForm.get('accountDetailsForm.file')?.value);

    this.accountService.registerDoctor(formData).subscribe({
      next: (_) => {
        this.currentStep.set(this.currentStep() + 1);
        this.isSubmittingApi.set(false);
      },
    });
  }

  async onSubmit() {
    switch (this.accountType()) {
      case 'doctor':
        await this.submitDoctorRegisterForm();
        break;
      case 'patient':
        this.submitPatientRegisterForm();
        break;
    }
  }
}
