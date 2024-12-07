import { CommonModule } from "@angular/common";
import { Component, OnInit, AfterViewInit, inject, input } from "@angular/core";
import { Validators } from "@angular/forms";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { FormInfo } from "src/app/_models/forms/formTypes";
import { AccountService } from "src/app/_services/account.service";
import { FormsService } from "src/app/_services/forms.service";
import { SnackbarService } from "src/app/_services/snackbar.service";
import { UtilsService } from "src/app/_services/utils.service";
import { MaterialModule } from "src/app/_shared/material.module";

declare var google: any;
export class Login {
  email: string | null = null;
  password: string | null = null;
  twoFactorCode: string | null = null;

  constructor(init?: Partial<Login>) {
    Object.assign(this, init);
  }
}

export const loginInfo: FormInfo<Login> = {
  email: { type: 'text', label: 'Email', validators: [Validators.required, Validators.email, Validators.maxLength(255)],
    validationErrors: {
      required: 'El nombre de usuario o el correo es requerido.',
      minlength:
        'El nombre de usuario o el correo debe tener al menos 6 caracteres.',
      maxlength:
        'El nombre de usuario o el correo no debe tener más de 255 caracteres.'
    },
   },
  password: { type: 'text', label: 'Password', validators: [Validators.required, Validators.minLength(8), Validators.maxLength(30)],
    validationErrors: {
      'required': 'La contraseña es requerida',
      'minlength': 'La contraseña debe tener al menos 6 caracteres.',
      'maxlength': 'La contraseña no debe tener más de 100 caracteres.'
    },
   },
  twoFactorCode: { type: 'text', label: 'Código',
    validationErrors: {
      required: 'El código de autenticación es requerido.',
      minlength:
        'El código de autenticación debe tener al menos 6 caracteres.',
      maxlength:
        'El código de autenticación no debe tener más de 6 caracteres.'
    },
   },
} as FormInfo<Login>;

export class LoginForm extends FormGroup2<Login> {
  constructor() {
    super(Login, new Login(), loginInfo);
  }

}

@Component({
  selector: '[signInBasicForm]',
  templateUrl: './sign-in-basic-form.component.html',
  standalone: true,
  imports: [ RouterModule, Forms2Module, CommonModule, MaterialModule, ],
})
export class SignInBasicFormComponent implements OnInit, AfterViewInit {
  accountService = inject(AccountService);
  private router = inject(Router);
  route = inject(ActivatedRoute);
  utils = inject(UtilsService);
  forms = inject(FormsService);
  snackbarService = inject(SnackbarService)

  form = new LoginForm();

  emailFromQuery: string = '';
  returnUrl: string = '/admin';
  focusOnEmail: boolean = false;
  focusOnPassword: boolean = false;
  redirectUrl: string | null = "/account";
  requiresTwoFactor: boolean = false;

  noRedirect = input<boolean>(false);

  constructor() {
    this.forms.mode$.subscribe({
      next: mode => {
        this.form.validation = mode;
      }
    });

    this.route.queryParams.subscribe({
      next: params => {
        if (params['redirectUrl']) {
          this.redirectUrl = params['redirectUrl'];
        }
      }
    });
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
      width: document.getElementById('google-btn')!.offsetWidth.toFixed(0).toString(),
      height: '80'
    });
  }

  onSubmit() {
    this.form.submitted = true;
    if (this.form.valid) {
      if (!this.requiresTwoFactor) {
        this.accountService.login(this.form.value).subscribe({
          next: response => {
            this.form.submitted = false;
            if (response.requiresTwoFactor) {
              this.requiresTwoFactor = true;
            } else {
              if (this.noRedirect()) return;
              if (this.redirectUrl) {
                this.router.navigate([this.redirectUrl]);
              } else {
                this.router.navigate([this.returnUrl]);
              }
            }
          }
        })
      } else {
        this.accountService.twoFactorLogin(this.form.controls.email.value!, this.form.controls.twoFactorCode.value!).subscribe({
          next: response => {
            if (this.noRedirect()) return;
            if (this.redirectUrl) {
              this.router.navigate([this.redirectUrl]);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          }
        });
      }
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
