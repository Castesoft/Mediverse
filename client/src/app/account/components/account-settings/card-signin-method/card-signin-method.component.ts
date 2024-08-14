import { Component, inject, OnInit, output } from '@angular/core';
import { AbstractControlOptions, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { AccountService } from 'src/app/_services/account.service';
import { LayoutModule } from 'src/app/_shared/layout.module';

@Component({
  selector: 'app-card-signin-method',
  standalone: true,
  imports: [LayoutModule, ReactiveFormsModule, InputControlComponent],
  templateUrl: './card-signin-method.component.html',
  styleUrl: './card-signin-method.component.scss'
})
export class CardSigninMethodComponent implements OnInit {
  private fb = inject(FormBuilder);
  accountService = inject(AccountService);
  onSelectSection = output<string>();

  submitted = false;
  isSettingUpTwoFactor = false;
  twoFactorSetupInfo: any;

  hideChangeEmailForm = true;
  changeEmailForm = this.fb.group({
    email: ['', Validators.email],
    password: ['', Validators.required]
  });

  hideChangePasswordForm = true;
  changePasswordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: [this.accountService.equalFields('newPassword','confirmPassword')]
  } as AbstractControlOptions);

  twoFactorAuthForm = this.fb.group({
    verificationCode: ['', Validators.required]
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
      this.changeEmailForm.get('email')?.setErrors({same: 'Ingresa un correo diferente al actual.'});
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
