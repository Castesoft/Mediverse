import { Component, inject, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { createId } from '@paralleldrive/cuid2';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { AccountService } from 'src/app/_services/account.service';
import { ToastrService } from "ngx-toastr";
import { AlertComponent } from "src/app/_forms2/helper/alert.component";
import { AuthNavigationService } from 'src/app/_services/auth-navigation.service';

@Component({
  selector: 'app-new-password-form',
  templateUrl: './new-password-form.component.html',
  styleUrl: './new-password-form.component.scss',
  imports: [ RouterModule, ReactiveFormsModule, InputControlComponent, AlertComponent ],
})
export class NewPasswordFormComponent implements OnInit {
  private accountService: AccountService = inject(AccountService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toastr: ToastrService = inject(ToastrService);
  private fb: FormBuilder = inject(FormBuilder);
  private authNavigation: AuthNavigationService = inject(AuthNavigationService);

  form: FormGroup = this.fb.group(
    {
      password: [ '', [ Validators.required, Validators.pattern(this.accountService.passwordPattern) ] ],
      confirm: [ '', [ Validators.required ] ],
    },
    { validators: this.accountService.equalFields('password', 'confirm') } as AbstractControlOptions
  );

  id: string = `newPasswordForm${createId()}`;
  isSubmitting: boolean = false;
  submitted: boolean = false;
  resetToken: string = '';
  errorMessage?: string;
  email: string = '';

  ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      const paramEmail: string | null = params.get('email');
      const paramToken: string | null = params.get('resetToken');

      if (!paramEmail || !paramToken) {
        this.errorMessage = "Operación inválida, intentalo de nuevo";
        this.authNavigation.navigateToSignIn().catch(console.error);
      }

      this.email = paramEmail!;
      this.resetToken = paramToken!;
    })
  }

  onSubmit() {
    this.submitted = true;
    this.isSubmitting = true;
    this.errorMessage = undefined;

    if (!this.form.valid) {
      console.error('Error submitting form: invalid form');
      this.isSubmitting = false;
      return;
    }

    const password: string = this.form.get('password')?.value;

    this.accountService.resetPasswordWithToken(this.resetToken, password, this.email).subscribe({
      next: (_) => {
        this.submitted = false;
        this.isSubmitting = false;
        this.form.reset();

        this.toastr.success(`¡Contraseña reestablecida!`);
        this.authNavigation.navigateToSignIn().catch(console.error);
      },
      error: (error: any) => {
        this.errorMessage = error.message;
        this.isSubmitting = false;
      }
    });
  }
}
