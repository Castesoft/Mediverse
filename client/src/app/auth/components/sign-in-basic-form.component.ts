import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { ControlsModule } from 'src/app/_forms/controls.module';
import {BadRequest} from "src/app/_models/types";
import { AccountService } from 'src/app/_services/account.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { createId } from '@paralleldrive/cuid2';
import { FormsService } from 'src/app/_services/forms.service';
import { MaterialModule } from 'src/app/_shared/material.module';
import { MatSnackBar } from '@angular/material/snack-bar';

export class LoginForm {
  id: string;
  group: FormGroup;
  error?: BadRequest;
  validation = false;
  submitted = false;

  constructor(creds = false) {
    this.id = `form${createId()}`;
    this.group = new FormGroup({
      email: new FormControl(''),
      password: new FormControl(''),
    });

    if (creds) {
      this.group.controls['email'].setValue('rcastellanos@castesoft.com');
      this.group.controls['password'].setValue('Pa$$w0rd');
    }
  }

  setValidators(validation: boolean) {
    this.validation = validation;

    const controls = this.group.controls;

    if (validation) {
      controls['email'].setValidators([Validators.required, Validators.email, Validators.maxLength(255)]);
      controls['password'].setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(30)]);
    } else {
      controls['email'].clearValidators(); controls['email'].clearAsyncValidators();
      controls['password'].clearValidators(); controls['password'].clearAsyncValidators();
    }
  }

}

@Component({
  selector: '[signInBasicForm]',
  templateUrl: './sign-in-basic-form.component.html',
  standalone: true,
  imports: [ RouterModule, ControlsModule, JsonPipe, MaterialModule, ],
})
export class SignInBasicFormComponent implements OnInit {
  private accountService = inject(AccountService);
  private router = inject(Router);
  route = inject(ActivatedRoute);
  utils = inject(UtilsService);
  forms = inject(FormsService);
  matSnackBar = inject(MatSnackBar);

  form = new LoginForm(true);
  emailFromQuery: string = 'ramiro@castellanosbarron.com';
  returnUrl: string = '/admin';
  focusOnEmail: boolean = false;
  focusOnPassword: boolean = false;
  redirectUrl: string | null = "/account";

  constructor() {
    this.forms.mode$.subscribe({
      next: mode => {
        this.form.setValidators(mode);
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
  }

  onSubmit() {
    console.log(this.form.group.value);
    this.form.submitted = true;
    if (this.form.group.valid) {
      this.accountService.login(this.form.group.value).subscribe({
        next: account => {
          this.form.submitted = false;
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        }
      })
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
