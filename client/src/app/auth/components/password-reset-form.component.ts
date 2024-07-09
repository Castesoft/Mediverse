import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { PasswordResetForm } from 'src/app/_models/account';
import { FormErrorModalService } from 'src/app/_services/form-error-modal.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { FormsService } from 'src/app/_services/forms.service';

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
