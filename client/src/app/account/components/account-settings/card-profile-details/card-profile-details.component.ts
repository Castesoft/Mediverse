import { Component, effect, inject, output } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlCheckListComponent } from 'src/app/_forms/control-check-list.component';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { PaymentMethodType } from 'src/app/_models/paymentMethodType';
import { Specialty } from 'src/app/_models/specialty';
import { AccountService } from 'src/app/_services/account.service';
import { LayoutModule } from 'src/app/_shared/layout.module';
import { Account, AccountForm } from 'src/app/_models/account';
import { UserProfilePictureComponent } from 'src/app/users/components/user-profile-picture/user-profile-picture.component';
import { FormControl2 } from 'src/app/_forms/form2';
import { BadRequest } from 'src/app/_models/types';
import { FormNewModule } from 'src/app/_forms/_new/forms-new.module';

@Component({
  selector: 'app-card-profile-details',
  standalone: true,
  imports: [LayoutModule, UserProfilePictureComponent, FormNewModule, ],
  templateUrl: './card-profile-details.component.html',
  styleUrl: './card-profile-details.component.scss'
})
export class CardProfileDetailsComponent {
  accountService = inject(AccountService);
  onSelectSection = output<string>();

  specialties: Specialty[] = [];
  paymentMethodTypes: PaymentMethodType[] = [];

  form = new AccountForm();

  photoFile: any;
  certificateFile: any;

  constructor() {
    effect(() => {
      if (this.accountService.current() !== null) {
        this.form.patchValue(new Account({...this.accountService.current()}) as any);
      }
    });
  }

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }

  onPhotoChange(event: any) {
    if (event.target.files.length > 0) {
      this.photoFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.form.controls.photoUrl.patchValue(e.target.result);
      };
      reader.readAsDataURL(this.photoFile);

      event.target.value = '';
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.certificateFile = event.target.files[0];
    }
  }

  onCancel() {
    if (this.accountService.current() !== null) {
      this.form.patchValue(new Account({...this.accountService.current()}) as any);
    }
    this.form.controls.photoUrl.patchValue(null);
    this.photoFile = undefined;
    this.certificateFile = undefined;
    const removeAvatarControl = this.form.controls.removeAvatar as FormControl2<boolean>;
    removeAvatarControl.patchValue(false);
    this.form.submitted = false;
  }

  removeAvatar() {
    this.form.controls.photoUrl.patchValue(null);
    this.photoFile = undefined;
    const removeAvatarControl = this.form.controls.removeAvatar as FormControl2<boolean>;
    removeAvatarControl.patchValue(true);
  }

  showRequireAnticipatedCardPaymentsField() {
    // if (this.profileDetailsForm.get('AcceptedPaymentMethods') === null) return false;
    // const paymentMethods = this.profileDetailsForm.get('AcceptedPaymentMethods')!.value as string;
    // return paymentMethods.split(',').includes('1') || paymentMethods.split(',').includes('2');
  }

  onSubmit() {
    // if (this.profileDetailsForm.get('SpecialtyId')?.value !== this.accountService.current()?.specialtyId!.toString()) {
    //   this.profileDetailsForm.get('file')?.setValidators([Validators.required]);
    //   this.profileDetailsForm.get('file')?.updateValueAndValidity();
    // } else {
    //   this.profileDetailsForm.get('file')?.clearValidators();
    //   this.profileDetailsForm.get('file')?.updateValueAndValidity();
    // }
    if (this.form.controls.specialty.value?.id !== this.accountService.current()?.specialty?.id) {
      this.form.controls.photoFile.setValidators([Validators.required]);
      this.form.controls.photoFile.updateValueAndValidity();
    } else {
      this.form.controls.photoFile.clearValidators();
      this.form.controls.photoFile.updateValueAndValidity();
    }

    this.form.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const jsonData: string = JSON.stringify(this.form.value);

    const formData = new FormData();

    formData.append('json', jsonData);
    if (this.form.controls.photoFile.value) {
      formData.append('photo', this.form.controls.photoFile.value);
    }
    if (this.form.controls.certificateFile.value) {
      formData.append('file', this.form.controls.certificateFile.value);
    }

    this.accountService.updateAccountDetails(formData).subscribe({
      next: response => {
        this.form.submitted = false;
        this.form.markAsPristine();
        this.form.updateValueAndValidity();
      },
      error: (error: BadRequest) => {
        this.form.error = error;
      }
    });
  }
}
