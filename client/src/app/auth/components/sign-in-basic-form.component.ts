import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, effect, inject, input, InputSignal, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
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
  standalone: true,
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
    effect((): LoginForm => this.form.setValidation(this.validation.active()));
  }

  ngOnInit(): void {
    this.getQueryParams();

    if (this.noRedirect()) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { noredirect: 'true' },
        queryParamsHandling: 'merge',
      });
    }
  }

  ngAfterViewInit() {
    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      locale: 'es',
      width: document.getElementById('google-btn')?.offsetWidth.toFixed(0).toString(),
      height: '80'
    });
  }

  onSubmit() {
    this.form.submitted = true;

    if (!this.form.valid) return;

    this.isSubmitting = true;

    if (!this.requiresTwoFactor) {
      this.accountService.login(this.form.value).subscribe({
        next: (response: Account) => {
          this.form.submitted = false;
          if (response.requiresTwoFactor) {
            this.requiresTwoFactor = true;
          } else {
            if (this.noRedirect()) return;
            this.router.navigateByUrl(this.returnUrl || '/cuenta').then(() => {});
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.form.error = err;
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      this.accountService.twoFactorLogin(this.form.controls.email.value!, this.form.controls.twoFactorCode.value!).subscribe({
        next: (_) => {
          if (this.noRedirect()) return;
          this.router.navigateByUrl(this.returnUrl || '/cuenta').then(() => {});
        },
        error: (err) => {
          console.error('Two-factor login error:', err);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    }
  }

  getQueryParams() {
    this.route.queryParams.subscribe({
      next: params => {
        if (params['email']) {
          this.emailFromQuery = params['email'];
          this.focusOnPassword = true;
          this.focusOnEmail = false;
        } else {
          this.focusOnEmail = true;
          this.focusOnPassword = false;
        }
        if (params['returnUrl']) this.returnUrl = params['returnUrl'];
      }
    });
  }
}
