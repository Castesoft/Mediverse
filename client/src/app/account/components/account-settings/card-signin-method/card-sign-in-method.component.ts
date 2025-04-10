import { Component, inject, OnInit, output, OutputEmitterRef } from '@angular/core';
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { AccountService } from 'src/app/_services/account.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import {
  EmailVerificationInputComponent
} from 'src/app/_shared/components/email-verification-input/email-verification-input.component';

@Component({
  selector: 'app-card-sign-in-method',
  templateUrl: './card-sign-in-method.component.html',
  styleUrl: './card-sign-in-method.component.scss',
  imports: [
    TemplateModule,
    ReactiveFormsModule,
    InputControlComponent,
    EmailVerificationInputComponent
  ],
})
export class CardSignInMethodComponent implements OnInit {
  private readonly fb: FormBuilder = inject(FormBuilder);

  readonly accountService: AccountService = inject(AccountService);
  readonly onSelectSection: OutputEmitterRef<string> = output<string>();

  submitted: boolean = false;
  isSettingUpTwoFactor: boolean = false;

  twoFactorSetupInfo: any;

  hideChangeEmailForm: boolean = true;
  changeEmailForm = this.fb.group({
    email: [ '', Validators.email ],
    password: [ '', Validators.required ]
  });

  hideChangePasswordForm = true;
  changePasswordForm = this.fb.group({
    currentPassword: [ '', Validators.required ],
    newPassword: [ '', Validators.required ],
    confirmPassword: [ '', Validators.required ]
  }, {
    validators: [ this.accountService.equalFields('newPassword', 'confirmPassword') ]
  } as AbstractControlOptions);

  twoFactorAuthForm = this.fb.group({
    verificationCode: [ '', Validators.required ]
  });

  ngOnInit() {
    this.changeEmailForm.get('email')?.setValue(this.accountService.current()?.email!);
  }

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }

  changeEmail() {
    this.submitted = true;
    if (this.changeEmailForm.get('email')?.value === this.accountService.current()?.email) {
      this.changeEmailForm.get('email')?.setErrors({ same: 'Ingresa un correo diferente al actual.' });
    }
    if (this.changeEmailForm.invalid) {
      return;
    }

    this.accountService.changeEmail(this.changeEmailForm.value).subscribe({
      next: () => {
        this.hideChangeEmailForm = true;
        this.submitted = false;
      }
    });
  }

  changePassword() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.accountService.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.hideChangePasswordForm = true;
        this.submitted = false;
      }
    });
  }

  toggleChangeEmailForm() {
    this.hideChangeEmailForm = !this.hideChangeEmailForm;
    if (!this.hideChangeEmailForm) {
      this.changeEmailForm.reset();
      this.changeEmailForm.get('email')?.setValue(this.accountService.current()?.email!);
      this.hideChangePasswordForm = true;
      this.submitted = false;
    }
  }

  toggleChangePasswordForm() {
    this.hideChangePasswordForm = !this.hideChangePasswordForm;
    if (!this.hideChangePasswordForm) {
      this.changePasswordForm.reset();
      this.hideChangeEmailForm = true;
      this.submitted = false;
    }
  }

  enableTwoFactor() {
    this.accountService.getTwoFactorSetupInfo().subscribe({
      next: (response) => {
        this.isSettingUpTwoFactor = true;
        this.twoFactorSetupInfo = response;
      }
    });
  }

  verifyTwoFactorAuth() {
    this.submitted = true;
    if (this.twoFactorAuthForm.invalid) {
      return;
    }

    this.accountService.enableTwoFactorAuth(this.twoFactorAuthForm.get('verificationCode')?.value!).subscribe({
      next: () => {
        this.submitted = false;
        this.isSettingUpTwoFactor = false;
        this.twoFactorSetupInfo = null;
      }
    });
  }

  disableTwoFactor() {
    this.accountService.disableTwoFactorAuth().subscribe();
  }
}
