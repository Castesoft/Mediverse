import { Component, inject, input, InputSignal, OnInit, output, OutputEmitterRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-email-verification-input',
  templateUrl: './email-verification-input.component.html',
  styleUrls: [ './email-verification-input.component.scss' ],
  imports: [
    TemplateModule,
    ReactiveFormsModule,
    InputControlComponent
  ],
})
export class EmailVerificationInputComponent implements OnInit {
  private readonly accountService: AccountService = inject(AccountService);
  private readonly toastr: ToastrService = inject(ToastrService);
  private readonly fb: FormBuilder = inject(FormBuilder);

  email: InputSignal<string> = input.required();
  verified: OutputEmitterRef<void> = output();

  verifyForm!: FormGroup;

  submitted: boolean = false;
  loadingVerify: boolean = false;
  loadingResend: boolean = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.verifyForm = this.fb.group({
      verificationCode: [ '', [ Validators.required, Validators.minLength(6), Validators.maxLength(6) ] ]
    });
  }

  verify(): void {
    this.submitted = true;
    if (this.verifyForm.invalid || !this.email) {
      return;
    }
    this.loadingVerify = true;
    const code = this.verifyForm.get('verificationCode')?.value;

    this.accountService.verifyEmail(this.email(), code)
      .pipe(finalize(() => {
        this.loadingVerify = false;
        this.submitted = false;
      }))
      .subscribe({
        next: () => {
          this.toastr.success('¡Correo electrónico verificado con éxito!');
          this.verifyForm.reset();
          this.verified.emit();
        },
        error: (err) => {
          this.verifyForm.get('verificationCode')?.setErrors({ invalidCode: true });
          console.error("Verification error:", err);
        }
      });
  }

  resendCode(): void {
    if (!this.email()) {
      this.toastr.error('Error: No se puede reenviar el código sin un correo electrónico.');
      return;
    }
    this.loadingResend = true;
    this.accountService.resendEmailVerificationCode().pipe(finalize(() => this.loadingResend = false))
      .subscribe({
        next: () => {
          this.toastr.success('Se ha enviado un nuevo código de verificación.');
        },
        error: (err) => {
          console.error("Error resending verification code:", err);
          this.toastr.error('Error al reenviar el código. Intenta de nuevo.');
        }
      });
  }
}
