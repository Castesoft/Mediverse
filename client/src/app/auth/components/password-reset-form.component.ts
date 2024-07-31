import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { PasswordResetForm } from 'src/app/_models/account';
import { FormErrorModalService } from 'src/app/_services/form-error-modal.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { FormsService } from 'src/app/_services/forms.service';
import { AccountService } from 'src/app/_services/account.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';

@Component({
  selector: '[passwordResetForm]',
  templateUrl: './password-reset-form.component.html',
  standalone: true,
  imports: [ RouterModule, ReactiveFormsModule, FormsModule, InputControlComponent,  ],
})
export class PasswordResetFormComponent implements OnInit {
  utils = inject(UtilsService);
  private fs = inject(FormsService);
  private errorModal = inject(FormErrorModalService);
  private accountService = inject(AccountService);
  private snackbarService = inject(SnackbarService)


  form = new PasswordResetForm();
  validationMode = false;

  ngOnInit(): void {
    this.fs.mode$.subscribe({
      next: mode => {
        console.log('mode', mode);
        this.validationMode = mode;
        this.form.setValidators(mode);
      }
    });
  }

  onSubmit() {
    this.form.submitted = true;
    if (this.form.formGroup.valid) {
      this.accountService.sendEmailForPasswordReset(this.form.formGroup.get('email')?.value).subscribe(response => {
        this.snackbarService.success(`Correo de confirmación enviado`);
        this.form.formGroup.reset();
        this.form.submitted = false;
      });
    } else {
      this.errorModal.show();
    }
  }

}
