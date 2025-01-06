import { CommonModule } from "@angular/common";
import { Component, OnInit, AfterViewInit, inject, input, effect } from "@angular/core";
import { RouterModule, Router, ActivatedRoute } from "@angular/router";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { AccountService } from "src/app/_services/account.service";
import { UtilsService } from "src/app/_services/utils.service";
import { ValidationService } from "src/app/_services/validation.service";
import { MaterialModule } from "src/app/_shared/material.module";
import { LoginForm } from "../models/login";

declare var google: any;

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
  validation = inject(ValidationService);

  form = new LoginForm();

  emailFromQuery: string = '';
  returnUrl: string = '/admin';
  focusOnEmail: boolean = false;
  focusOnPassword: boolean = false;
  redirectUrl: string | null = "/cuenta";
  requiresTwoFactor: boolean = false;

  noRedirect = input<boolean>(false);

  constructor() {
    effect((): LoginForm => this.form.setValidation(this.validation.active()));

    this.route.queryParams.subscribe({
      next: params => {
        if (params['redirectUrl']) this.redirectUrl = params['redirectUrl'];
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
      width: document.getElementById('google-btn')?.offsetWidth.toFixed(0).toString(),
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
                this.router.navigate([ this.redirectUrl ]);
              } else {
                this.router.navigate([ this.returnUrl ]);
              }
            }
          }
        })
      } else {
        this.accountService.twoFactorLogin(this.form.controls.email.value!, this.form.controls.twoFactorCode.value!).subscribe({
          next: _ => {
            if (this.noRedirect()) return;
            if (this.redirectUrl) {
              this.router.navigate([ this.redirectUrl ]);
            } else {
              this.router.navigate([ this.returnUrl ]);
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
