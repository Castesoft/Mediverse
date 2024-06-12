import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordResetForm } from '../../models/account';
import { UtilsService } from '../../../core/services/utils.service';
import { FormsService } from '../../../core/services/forms-service.service';
import { FormErrorModalService } from '../../../core/services/form-error-modal.service';

@Component({
  selector: '[passwordResetForm]',
  templateUrl: './password-reset-form.component.html'
})
export class PasswordResetFormComponent implements OnInit {
  form!: PasswordResetForm;
  validationMode = false;

  constructor(
    public utils: UtilsService,
    private router: Router,
    private fs: FormsService,
    private errorModal: FormErrorModalService,
  ) {
    this.form = new PasswordResetForm();
    console.log('form', this.form);
  }

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
      this.router.navigate(['/auth/sign-in/new-password']);
    } else {
      this.errorModal.show();
    }
  }

}
