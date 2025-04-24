import { Component, effect, inject, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
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
import { AccountService } from 'src/app/_services/account.service';
import { AccountCompletedComponent } from './account-completed/account-completed.component';
import PatientRegisterForm from 'src/app/_models/auth/patientRegister/patientRegisterForm';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { createId } from '@paralleldrive/cuid2';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { PaymentMethodResult } from "@stripe/stripe-js";
import { Account } from "src/app/_models/account/account";
import {
  authFormSteps,
  authFormStepsDoctor,
  authFormStepsPatient
} from "src/app/auth/components/sign-up/register-patient-form/sign-up-steps";
import {
  AccountDetailsComponent
} from "src/app/auth/components/sign-up/register-doctor-form/account-details/account-details.component";
import {
  AccountSettingsComponent
} from "src/app/auth/components/sign-up/register-doctor-form/account-settings/account-settings.component";
import {
  BillingDetailsComponent
} from "src/app/auth/components/sign-up/register-doctor-form/billing-details/billing-details.component";
import { AuthNavigationService } from "src/app/_services/auth-navigation.service";

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
    AccountCompletedComponent,
    Forms2Module,
    AccountDetailsComponent,
    AccountSettingsComponent,
    BillingDetailsComponent,
  ],
})
export class SignUpComponent implements OnInit {
  private readonly authNavigationService: AuthNavigationService = inject(AuthNavigationService);
  private readonly accountService: AccountService = inject(AccountService);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  readonly fb: FormBuilder = inject(FormBuilder);
  @ViewChild(BillingDetailsComponent) billingDetails!: BillingDetailsComponent;

  accountType: WritableSignal<'patient' | 'doctor'> = signal('patient');
  submissionErrors: WritableSignal<BadRequest | null> = signal(null);
  isSubmitting: WritableSignal<boolean> = signal(false);
  formId: WritableSignal<string> = signal(createId());
  currentStep: WritableSignal<number> = signal(1);

  firstName?: string;

  constructor() {
    effect(() => {
      const newParams: any = {
        type: this.accountType(),
        step: this.currentStep(),
      };

      this.router.navigate([], {
        queryParams: newParams,
        queryParamsHandling: 'merge',
      }).then(() => {});
    });

    effect(() => {
      if (this.accountType() === 'patient') {
        this.formId.set(this.patientRegisterForm().id);
      }
    });
  }

  ngOnInit(): void {
    const typeParam = this.route.snapshot.queryParamMap.get('type');
    if (typeParam === 'doctor') {
      this.accountType.set('doctor');
    } else {
      this.accountType.set('patient');
      this.formId.set(this.patientRegisterForm().id);
    }

    const stepParam = this.route.snapshot.queryParamMap.get('step');
    if (stepParam) {
      this.currentStep.set(parseInt(stepParam, 10) || 1);
    }
  }

  patientRegisterForm: WritableSignal<PatientRegisterForm> = signal(new PatientRegisterForm());

  doctorForm: FormGroup = this.fb.group({
    accountSettingsForm: this.fb.group({
      FirstName: [ '', [ Validators.required, Validators.minLength(3) ] ],
      LastName: [ '', [ Validators.required, Validators.minLength(3) ] ],
      Gender: [ 'Masculino', [ Validators.required ] ],
      Email: [ '', [ Validators.required, Validators.pattern(this.accountService.emailPattern) ] ],
      Phone: [ '', [ Validators.required, Validators.pattern(this.accountService.phonePattern) ] ],
      Password: [ '', [ Validators.required, Validators.pattern(this.accountService.passwordPattern) ] ],
      ConfirmPassword: [ '', [ Validators.required ] ],
      AgreeTerms: [ false, [ Validators.requiredTrue ] ]
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
      SpecialtyLicense: [ '', [ Validators.required ] ],
      LicenseNumber: [ '', [ Validators.required ] ],
      certification: [ '', [ Validators.required ] ],
      file: [ '' ],
      AcceptedPaymentMethods: [ '', [ Validators.required ] ],
      RequireAnticipatedCardPayments: [ false ],
    }),
    billingDetailsForm: this.fb.group({
      SameAddress: [ true, [ Validators.required ] ],
      State: [ '' ],
      City: [ '' ],
      Street: [ '' ],
      Zipcode: [ '' ],
      Neighborhood: [ '' ],
      ExteriorNumber: [ '' ],
      InteriorNumber: [ '' ],
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
    if (this.currentStep() === 1) return authFormSteps;
    if (this.accountType() === 'patient') return authFormStepsPatient;
    return authFormStepsDoctor;
  }

  onNextStep() {

    if (this.accountType() === 'doctor') {
      let currentFormGroup: FormGroup | null = null;
      if (this.currentStep() === 2) {
        currentFormGroup = this.doctorForm.get('accountSettingsForm') as FormGroup;
      } else if (this.currentStep() === 3) {
        currentFormGroup = this.doctorForm.get('accountDetailsForm') as FormGroup;
      }

      if (currentFormGroup) {
        currentFormGroup.markAllAsTouched();
        if (!currentFormGroup.valid) {
          console.log(`Doctor form step ${this.currentStep()} is invalid.`);
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
    if (!this.patientRegisterForm().valid) {
      this.isSubmitting.set(false);
      return;
    }
    this.isSubmitting.set(true);

    this.accountService.register(this.patientRegisterForm().getRawValue()).subscribe({
      next: (account: Account) => {
        this.firstName = account.firstName || undefined;
        this.currentStep.set(this.currentStep() + 1);
        this.isSubmitting.set(false);

        const queryParams: ParamMap = this.route.snapshot.queryParamMap;
        const invitationToken = queryParams.get('invitationToken');
        const invitationReturnUrl = queryParams.get('returnUrl');

        if (invitationToken && invitationReturnUrl) {
          console.log(`Invitation context found after patient signup. Token: ${invitationToken}, Redirecting to: ${invitationReturnUrl}`);
          this.router.navigateByUrl(invitationReturnUrl).catch(err => {
            console.error('Failed to redirect back to accept invitation after patient signup:', err);
            this.authNavigationService.navigateToVerifyEmail().catch(console.error);
          });
        } else {
          console.log("No invitation context found, proceeding with email verification flow.");
          this.authNavigationService.navigateToVerifyEmail().catch(console.error);
        }
      },
      error: (error: BadRequest) => {
        this.patientRegisterForm().error = error;
        this.isSubmitting.set(false);
      }
    });
  }

  async submitDoctorRegisterForm() {
    this.doctorForm.markAllAsTouched();
    if (!this.doctorForm.valid || !this.billingDetails?.stripe || !this.billingDetails?.cardNumber) {
      this.isSubmitting.set(false);
      console.log("Doctor form invalid or billing details missing.");
      return;
    }
    this.isSubmitting.set(true);

    let paymentMethod: PaymentMethodResult | undefined;
    try {
      paymentMethod = await this.billingDetails.stripe.createPaymentMethod({
        type: 'card',
        card: this.billingDetails.cardNumber!
      });

      if (paymentMethod.error) {
        console.error("Stripe PaymentMethod creation error:", paymentMethod.error);
        this.submissionErrors.set({
          type: 'BadRequest',
          message: `Error al crear método de pago: ${paymentMethod.error.message}`,
          validationErrors: [],
          error: { status: 400, message: paymentMethod.error.message } as any
        });
        this.isSubmitting.set(false);
        return;
      }
    } catch (stripeError) {
      console.error("Error during Stripe operation:", stripeError);
      this.submissionErrors.set({
        type: 'BadRequest',
        message: 'Ocurrió un error con el procesador de pagos. Por favor, inténtelo de nuevo.',
        validationErrors: [],
        error: { status: 500, message: 'Stripe Error' } as any
      });
      this.isSubmitting.set(false);
      return;
    }

    this.doctorForm.get('billingDetailsForm.StripePaymentMethodId')?.setValue(paymentMethod?.paymentMethod?.id);
    this.doctorForm.get('billingDetailsForm.Last4')?.setValue(paymentMethod?.paymentMethod?.card?.last4);
    this.doctorForm.get('billingDetailsForm.ExpirationMonth')?.setValue(paymentMethod?.paymentMethod?.card?.exp_month);
    this.doctorForm.get('billingDetailsForm.ExpirationYear')?.setValue(paymentMethod?.paymentMethod?.card?.exp_year);
    this.doctorForm.get('billingDetailsForm.Brand')?.setValue(paymentMethod?.paymentMethod?.card?.brand);
    this.doctorForm.get('billingDetailsForm.Country')?.setValue(paymentMethod?.paymentMethod?.card?.country);

    if (this.doctorForm.get('billingDetailsForm.SameAddress')?.value) {
      this.doctorForm.get('billingDetailsForm.State')?.setValue(this.doctorForm.get('accountDetailsForm.State')?.value);
      this.doctorForm.get('billingDetailsForm.City')?.setValue(this.doctorForm.get('accountDetailsForm.City')?.value);
      this.doctorForm.get('billingDetailsForm.Street')?.setValue(this.doctorForm.get('accountDetailsForm.Street')?.value);
      this.doctorForm.get('billingDetailsForm.Zipcode')?.setValue(this.doctorForm.get('accountDetailsForm.Zipcode')?.value);
      this.doctorForm.get('billingDetailsForm.Neighborhood')?.setValue(this.doctorForm.get('accountDetailsForm.Neighborhood')?.value);
      this.doctorForm.get('billingDetailsForm.ExteriorNumber')?.setValue(this.doctorForm.get('accountDetailsForm.ExteriorNumber')?.value);
      this.doctorForm.get('billingDetailsForm.InteriorNumber')?.setValue(this.doctorForm.get('accountDetailsForm.InteriorNumber')?.value);
    }

    const accountSettingsFormData: any = this.doctorForm.get('accountSettingsForm')?.getRawValue();
    const accountDetailsFormData: any = this.doctorForm.get('accountDetailsForm')?.getRawValue();
    const billingDetailsFormData: any = this.doctorForm.get('billingDetailsForm')?.getRawValue();

    const formData = new FormData();

    Object.keys(accountSettingsFormData).forEach((key: string) => {
      const value: any = accountSettingsFormData[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    Object.keys(accountDetailsFormData).forEach((key: string) => {
      const value: any = accountDetailsFormData[key];
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const billingMapping: { [key: string]: string } = {
      State: 'BillingState', City: 'BillingCity', Street: 'BillingStreet',
      Zipcode: 'BillingZipcode', Neighborhood: 'BillingNeighborhood',
      ExteriorNumber: 'BillingExteriorNumber', InteriorNumber: 'BillingInteriorNumber'
    };

    Object.keys(billingDetailsFormData).forEach((key: string) => {
      const value: any = billingDetailsFormData[key];
      if (value !== null && value !== undefined) {
        formData.append(billingMapping[key] || key, value.toString());
      }
    });

    const fileValue: any = this.doctorForm.get('accountDetailsForm.file')?.value;
    if (fileValue instanceof File) {
      formData.append('file', fileValue, fileValue.name);
    }

    this.accountService.registerDoctor(formData).subscribe({
      next: (account: Account) => {
        this.firstName = account.firstName || undefined;
        this.currentStep.set(this.currentStep() + 1);
        this.isSubmitting.set(false);

        const queryParams: ParamMap = this.route.snapshot.queryParamMap;
        const invitationToken = queryParams.get('invitationToken');
        const invitationReturnUrl = queryParams.get('returnUrl');

        if (invitationToken && invitationReturnUrl) {
          console.log(`Invitation context found after doctor signup. Token: ${invitationToken}, Redirecting to: ${invitationReturnUrl}`);
          this.router.navigateByUrl(invitationReturnUrl).catch(err => {
            console.error('Failed to redirect back to accept invitation after doctor signup:', err);
            this.authNavigationService.navigateToVerifyEmail().catch(console.error);
          });
        } else {
          console.log("No invitation context found, proceeding with email verification flow.");
          this.authNavigationService.navigateToVerifyEmail().catch(console.error);
        }
      },
      error: (error: BadRequest) => {
        this.submissionErrors.set(error);
        this.isSubmitting.set(false);
      }
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
