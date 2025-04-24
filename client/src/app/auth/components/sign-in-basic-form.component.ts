import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, effect, inject, input, InputSignal, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router, RouterModule } from "@angular/router";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { AccountService } from "src/app/_services/account.service";
import { UtilsService } from "src/app/_services/utils.service";
import { ValidationService } from "src/app/_services/validation.service";
import { AuthNavigationService } from "src/app/_services/auth-navigation.service";
import { MaterialModule } from "src/app/_shared/material.module";
import { LoginForm } from "../models/login";
import { Account } from "src/app/_models/account/account";

declare var google: any;

@Component({
  selector: '[signInBasicForm]',
  templateUrl: './sign-in-basic-form.component.html',
  imports: [
    RouterModule,
    Forms2Module,
    CommonModule,
    MaterialModule,
  ],
})
export class SignInBasicFormComponent implements OnInit, AfterViewInit {
  private readonly router: Router = inject(Router);
  readonly accountService: AccountService = inject(AccountService);
  readonly route: ActivatedRoute = inject(ActivatedRoute);
  readonly utils: UtilsService = inject(UtilsService);
  readonly validation: ValidationService = inject(ValidationService);
  readonly authNavigation: AuthNavigationService = inject(AuthNavigationService);

  form: LoginForm = new LoginForm();

  emailFromQuery: string = '';
  returnUrl: string = '/cuenta';
  focusOnEmail: boolean = false;
  focusOnPassword: boolean = false;
  requiresTwoFactor: boolean = false;
  isSubmitting: boolean = false;

  noRedirect: InputSignal<boolean> = input(false);

  constructor() {
    effect(() => this.form.setValidation(this.validation.active()));
  }

  ngOnInit(): void {
    this.getQueryParams();

    if (this.noRedirect()) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { noredirect: 'true' },
        queryParamsHandling: 'merge',
      }).catch(console.error);
    }
  }

  ngAfterViewInit() {
    const queryParams: ParamMap = this.route.snapshot.queryParamMap;
    const hasInvitationContext: boolean = queryParams.has('invitationToken') && queryParams.has('returnUrl');

    if (!hasInvitationContext) {
      const googleBtnElement: HTMLElement | null = document.getElementById('google-btn');
      if (googleBtnElement) {
        google.accounts.id.renderButton(googleBtnElement, {
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          locale: 'es',
          width: googleBtnElement.offsetWidth.toFixed(0).toString(),
          height: '80'
        });
      } else {
        console.warn("Google button container 'google-btn' not found.");
      }
    }
  }

  onSubmit() {
    this.form.submitted = true;
    if (!this.form.valid) {
      this.isSubmitting = false;
      return;
    }
    this.isSubmitting = true;

    if (!this.requiresTwoFactor) {
      this.accountService.login(this.form.value).subscribe({
        next: (response: Account) => {
          this.form.submitted = false;
          if (response.requiresTwoFactor) {
            this.requiresTwoFactor = true;
            this.isSubmitting = false;
          } else {

            const queryParams: ParamMap = this.route.snapshot.queryParamMap;
            const invitationToken: string | null = queryParams.get('invitationToken');
            const invitationReturnUrl: string | null = queryParams.get('returnUrl');

            if (invitationToken && invitationReturnUrl) {
              console.log(`Invitation context found after login. Token: ${invitationToken}, Redirecting to: ${invitationReturnUrl}`);

              this.router.navigateByUrl(invitationReturnUrl).catch(err => {
                console.error('Failed to redirect back to accept invitation after login:', err);

                this.router.navigateByUrl(this.returnUrl || '/cuenta').catch(console.error);
              });
            } else {

              console.log("No invitation context found, proceeding with normal login flow.");
              if (this.noRedirect()) {

                console.log("noRedirect is true, staying on page.");
                this.isSubmitting = false;
                return;
              }

              this.router.navigateByUrl(this.returnUrl || '/cuenta').catch(console.error);
            }

          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.form.error = err;
          this.isSubmitting = false;
        },

      });
    } else {

      this.accountService.twoFactorLogin(this.form.controls.email.value!, this.form.controls.twoFactorCode.value!).subscribe({
        next: (_) => {
          const queryParams: ParamMap = this.route.snapshot.queryParamMap;
          const invitationToken: string | null = queryParams.get('invitationToken');
          const invitationReturnUrl: string | null = queryParams.get('returnUrl');

          if (invitationToken && invitationReturnUrl) {
            console.log(`Invitation context found after 2FA. Token: ${invitationToken}, Redirecting to: ${invitationReturnUrl}`);
            this.router.navigateByUrl(invitationReturnUrl).catch(err => {
              console.error('Failed to redirect back to accept invitation after 2FA:', err);
              this.router.navigateByUrl(this.returnUrl || '/cuenta').catch(console.error);
            });
          } else {

            console.log("No invitation context found after 2FA, proceeding with normal flow.");
            if (this.noRedirect()) {
              console.log("noRedirect is true after 2FA, staying on page.");
              this.isSubmitting = false;
              return;
            }
            this.router.navigateByUrl(this.returnUrl || '/cuenta').catch(console.error);
          }

        },
        error: (err) => {
          console.error('Two-factor login error:', err);
          this.form.controls.twoFactorCode?.setErrors({ invalidCode: true });
          this.isSubmitting = false;
        },
      });
    }
  }

  getQueryParams() {
    const params: ParamMap = this.route.snapshot.queryParamMap;
    if (params.has('email')) {
      this.emailFromQuery = params.get('email')!;
      this.form.controls.email.patchValue(this.emailFromQuery);
      this.focusOnPassword = true;
      this.focusOnEmail = false;
    } else {
      this.focusOnEmail = true;
      this.focusOnPassword = false;
    }

    const generalReturnUrl: string | null = params.get('returnUrl');
    const invitationReturnUrl: string | null = params.get('invitationReturnUrl');

    if (generalReturnUrl && !invitationReturnUrl) {
      this.returnUrl = generalReturnUrl;
    } else if (!generalReturnUrl && !invitationReturnUrl) {
      this.returnUrl = '/cuenta';
    }

  }
}
