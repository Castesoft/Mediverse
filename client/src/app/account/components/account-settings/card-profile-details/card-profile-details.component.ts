import { Component, inject, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlCheckListComponent } from 'src/app/_forms/control-check-list.component';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { PaymentMethodType } from 'src/app/_models/paymentMethodType';
import { Specialty } from 'src/app/_models/specialty';
import { AccountService } from 'src/app/_services/account.service';
import { LayoutModule } from 'src/app/_shared/layout.module';
import { UserProfilePictureComponent } from "../../../../users/components/user-profile-picture/user-profile-picture.component";
import { Account } from 'src/app/_models/account';

@Component({
  selector: 'app-card-profile-details',
  standalone: true,
  imports: [LayoutModule, ReactiveFormsModule, ControlSelectComponent, InputControlComponent, ControlCheckListComponent, UserProfilePictureComponent],
  templateUrl: './card-profile-details.component.html',
  styleUrl: './card-profile-details.component.scss'
})
export class CardProfileDetailsComponent {
  private fb = inject(FormBuilder);
  accountService = inject(AccountService);
  onSelectSection = output<string>();

  submitted = false;
  specialties: Specialty[] = [];
  paymentMethodTypes: PaymentMethodType[] = [];

  profileDetailsForm = this.fb.group({
    FirstName: [''],
    LastName: [''],
    PhoneNumber: [''],
    LicenseNumber: [''],
    SpecialtyLicense: [''],
    SpecialtyId: [''],
    // subspecialtyId: [''],
    file: [''],
    AcceptedPaymentMethods: [''],
    RequireAnticipatedCardPayments: [false],
    RemoveAvatar: [false]
  });
  photoFile: any;
  photoUrl: any;
  certificateFile: any;

  get userForProfilePicture() {
    return {
      ...this.accountService.current(),
      photoUrl: this.profileDetailsForm.get('RemoveAvatar')?.value ? null : this.accountService.current()?.photoUrl
    } as Account;
  }

  ngOnInit() {
    this.accountService.getFormFields().subscribe({
      next: (response) => {
        this.specialties = response.specialties;
        this.paymentMethodTypes = response.paymentMethodTypes;
      }
    })

    this.setInitialFormValues();
  }

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }

  onPhotoChange(event: any) {
    if (event.target.files.length > 0) {
      this.photoFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result;
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

  setInitialFormValues() {
    this.profileDetailsForm.get('FirstName')?.setValue(this.accountService.current()?.firstName!);
    this.profileDetailsForm.get('LastName')?.setValue(this.accountService.current()?.lastName!);
    this.profileDetailsForm.get('PhoneNumber')?.setValue(this.accountService.current()?.phoneNumber!);
    this.profileDetailsForm.get('SpecialtyId')?.setValue(this.accountService.current()?.specialtyId!.toString()!);
    this.profileDetailsForm.get('AcceptedPaymentMethods')?.setValue(this.accountService.current()?.paymentMethodTypes!.map(x => x.id).join(',')!);
    this.profileDetailsForm.get('RequireAnticipatedCardPayments')?.setValue(this.accountService.current()?.requireAnticipatedCardPayments!);
  }

  onCancel() {
    this.setInitialFormValues();
    this.photoUrl = undefined;
    this.photoFile = undefined;
    this.certificateFile = undefined;
    this.profileDetailsForm.get('RemoveAvatar')?.setValue(false);
    this.submitted = false;
  }

  removeAvatar() {
    this.photoUrl = undefined;
    this.photoFile = undefined;
    this.profileDetailsForm.get('RemoveAvatar')?.setValue(true);
  }

  showRequireAnticipatedCardPaymentsField() {
    if (this.profileDetailsForm.get('AcceptedPaymentMethods') === null) return false;
    const paymentMethods = this.profileDetailsForm.get('AcceptedPaymentMethods')!.value as string;
    return paymentMethods.split(',').includes('1') || paymentMethods.split(',').includes('2');
  }

  setValueAnticipatedCardPayments(e: any) {
    if (e.target.checked) {
      this.profileDetailsForm.get('RequireAnticipatedCardPayments')?.setValue(true);
    } else {
      this.profileDetailsForm.get('RequireAnticipatedCardPayments')?.setValue(false);
    }
  }

  onSubmit() {
    if (this.profileDetailsForm.get('SpecialtyId')?.value !== this.accountService.current()?.specialtyId!.toString()) {
      this.profileDetailsForm.get('file')?.setValidators([Validators.required]);
      this.profileDetailsForm.get('file')?.updateValueAndValidity();
    } else {
      this.profileDetailsForm.get('file')?.clearValidators();
      this.profileDetailsForm.get('file')?.updateValueAndValidity();
    }

    this.submitted = true;

    if (this.profileDetailsForm.invalid) {
      return;
    }

    const jsonData = JSON.stringify(this.profileDetailsForm.value);

    const formData = new FormData();

    formData.append('json', jsonData);
    if (this.photoFile) {
      formData.append('photo', this.photoFile);
    }
    if (this.certificateFile) {
      formData.append('file', this.certificateFile);
    }

    this.accountService.updateAccountDetails(formData).subscribe({
      next: () => {
        this.submitted = false;
      }
    });
  }
}
