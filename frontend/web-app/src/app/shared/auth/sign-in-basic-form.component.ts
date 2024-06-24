import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UtilsService } from '../../core/services/utils.service';
import { AccountService } from '../../_services/accounts.service';
import { InputControlComponent } from '../../_forms/form-control.component';
import { FormControlPasswordComponent } from '../../_forms/form-control-password.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: '[signInBasicForm]',
  templateUrl: './sign-in-basic-form.component.html',
  standalone: true,
  imports: [ InputControlComponent, FormControlPasswordComponent, RouterModule, ReactiveFormsModule, InputControlComponent,
    JsonPipe,
   ],
})
export class SignInBasicFormComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({})
  submitAttempted: boolean = false;
  emailFromQuery: string = 'ramiro@castellanosbarron.com';
  returnUrl: string = '/admin';
  focusOnEmail: boolean = false;
  focusOnPassword: boolean = false;
  redirectUrl: string | null = "/dashboards";

  constructor(private fb: FormBuilder, private accountService: AccountService,
    private toastr: ToastrService, private router: Router, public route: ActivatedRoute, public utils: UtilsService) {
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
    this.initForm();
  }

  onSubmit() {
    this.submitAttempted = true;
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: account => {
          this.submitAttempted = false;

          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
          } else {
            this.router.navigate([this.returnUrl]);
          }
        }
      })
    }
  }

  initForm() {
    this.loginForm = this.fb.group({
      usernameOrEmail: [this.emailFromQuery, [Validators.required, Validators.maxLength(255)]],
      password: ['Pa$$w0rd', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    })
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
