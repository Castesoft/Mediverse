import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormErrorModalService } from '../../core/services/form-error-modal.service';
import { FormsService } from '../../core/services/forms-service.service';
import { UtilsService } from '../../core/services/utils.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordResetForm } from '../../_models/account';
import { InputControlComponent } from '../../_forms/form-control.component';

@Component({
  selector: '[passwordResetForm]',
  templateUrl: './password-reset-form.component.html',
  standalone: true,
  imports: [ RouterModule, ReactiveFormsModule, FormsModule, InputControlComponent,  ],
})
export class PasswordResetFormComponent implements OnInit {
  utils = inject(UtilsService);
  private router = inject(Router);
  private fs = inject(FormsService);
  private errorModal = inject(FormErrorModalService);

  
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
      this.router.navigate(['/auth/sign-in/new-password']);
    } else {
      this.errorModal.show();
    }
  }

}
