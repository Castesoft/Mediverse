import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { PasswordResetForm } from 'src/app/_models/account';
import { AccountService } from 'src/app/_services/account.service';
import { AlertComponent } from "src/app/_forms2/helper/alert.component";
import { AuthNavigationService } from "src/app/_services/auth-navigation.service";

@Component({
  selector: '[passwordResetForm]',
  templateUrl: './password-reset-form.component.html',
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    InputControlComponent,
    AlertComponent,
  ],
  standalone: true,
})
export class PasswordResetFormComponent implements OnInit {
  private readonly accountService: AccountService = inject(AccountService);
  authNavigation = inject(AuthNavigationService);

  form: PasswordResetForm = new PasswordResetForm();
  isSubmitting: boolean = false;

  showSuccessAlert: boolean = false;
  successMessage: string = `Si tu correo existe en nuestro sistema, te enviamos instrucciones para restablecer tu contraseña.`;

  showErrorAlert: boolean = false;
  errorMessage: string = `Ha ocurrido un error al procesar tu solicitud. Por favor, intenta de nuevo.`;


  ngOnInit(): void {
    this.form.setValidators(true);
  }

  onSubmit() {
    this.form.submitted = true;
    this.isSubmitting = true;

    const email: any = this.form.formGroup.get('email')?.value;
    if (!email) {
      console.error('Error submitting form: email is required');
      this.isSubmitting = false;
      return;
    }

    if (this.form.formGroup.valid) {
      this.accountService.sendEmailForPasswordReset(email).subscribe({
        next: (_) => {
          this.form.formGroup.reset();
          this.form.submitted = false;
          this.showSuccessAlert = true;
          this.isSubmitting = false;
        },
        error: (_) => {
          this.showErrorAlert = true;
          this.isSubmitting = false;
        }
      });
    }
  }
}
