import { LayoutModule } from "@angular/cdk/layout";
import { Component, inject, output, effect, OutputEmitterRef, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { Account } from "src/app/_models/account/account";
import { AccountForm } from "src/app/_models/account/accountForm";
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { FormControl2 } from "src/app/_models/forms/formControl2";
import { PaymentMethodType } from "src/app/_models/paymentMethodTypes/paymentMethodType";
import { Specialty } from "src/app/_models/specialties/specialty";
import { AccountService } from "src/app/_services/account.service";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { ImageThumbnailSelectorComponent } from "src/app/_shared/components/image-thumbnail-selector.component";
import { ImageHandlerService } from "src/app/_services/image-handler.service";
import { Photo } from "src/app/_models/forms/example/_models/photo";
import { CardFooterComponent } from "src/app/_shared/template/components/cards/card-footer.component";
import { firstValueFrom } from "rxjs";
import { confirmActionModal } from "src/app/_models/base/types";
import { ConfirmService } from "src/app/_services/confirm/confirm.service";
import { SpecialtiesService } from "src/app/specialties/specialties.config";
import { SelectOption } from "src/app/_models/base/selectOption";
import { ControlCheckListComponent } from "src/app/_forms/control-check-list.component";
import { JsonPipe } from "@angular/common";

@Component({
  selector: 'app-card-profile-details',
  standalone: true,
  imports: [
    LayoutModule,
    Forms2Module,
    ImageThumbnailSelectorComponent,
    CardFooterComponent,
  ],
  templateUrl: './card-profile-details.component.html',
})
export class CardProfileDetailsComponent implements OnInit {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;

  accountService: AccountService = inject(AccountService);
  imageHandler: ImageHandlerService = inject(ImageHandlerService);
  specialtiesService: SpecialtiesService = inject(SpecialtiesService);
  confirmService: ConfirmService = inject(ConfirmService);
  onSelectSection: OutputEmitterRef<string> = output();

  specialties: SelectOption[] = [];
  paymentMethodTypes: PaymentMethodType[] = [];

  form: AccountForm = new AccountForm();

  photoFile: any;
  certificateFile: any;

  constructor() {
    effect(() => {
      if (this.accountService.current()) {
        this.form.patchValue(this.accountService.current() as any);
        const userSpecialty: SelectOption | null = this.accountService.current()?.specialty || null;

        if (userSpecialty) {
          this.form.controls.specialty.patchValue(this.specialties.find((opt) => opt.id === userSpecialty.id) || null);
        }
      }
    });
  }

  ngOnInit(): void {
    this.initializeImages();
    this.setOptions();
    this.initForm();
  }

  private initializeImages() {
    const profilePhoto: Photo = {
      isMain: true,
      url: this.accountService.current()?.photoUrl || undefined,
    }
    this.imageHandler.initialize([ profilePhoto ]);
  }

  private setOptions() {
    this.specialtiesService.getOptions().subscribe({
      next: (specialties: SelectOption[]) => {
        this.specialties = specialties
        this.form.controls.specialty.selectOptions = specialties;

        const userSpecialty: SelectOption | null = this.accountService.current()?.specialty || null;

        if (userSpecialty) {
          this.form.controls.specialty.patchValue(specialties.find((opt) => opt.id === userSpecialty.id) || null);
        }
      }
    });
  }

  private initForm() {
    this.form.controls.firstName.showLabel = false;
    this.form.controls.lastName.showLabel = false;
    this.form.controls.phoneNumber.showLabel = false;
    this.form.controls.licenseNumber.showLabel = false;
    this.form.controls.specialtyLicense.showLabel = false;
    this.form.controls.specialty.showLabel = false;
    this.form.controls.acceptedPaymentMethods.showLabel = false;
    this.form.controls.requireAnticipatedCardPayments.showLabel = false;

    this.form.controls.firstName.solid = true;
    this.form.controls.lastName.solid = true;
    this.form.controls.phoneNumber.solid = true;
    this.form.controls.licenseNumber.solid = true;
    this.form.controls.specialtyLicense.solid = true;
    this.form.controls.specialty.solid = true;
    this.form.controls.acceptedPaymentMethods.solid = true;
    this.form.controls.requireAnticipatedCardPayments.solid = true;
  }

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }

  onCancel() {
    if (this.accountService.current() !== null) {
      this.form.patchValue(new Account({ ...this.accountService.current() }) as any);
    }
    this.form.controls.photoUrl.patchValue(null);
    this.photoFile = undefined;
    this.certificateFile = undefined;
    const removeAvatarControl = this.form.controls.removeAvatar as FormControl2<boolean>;
    removeAvatarControl.patchValue(false);
    this.form.submitted = false;
  }

  async onSubmit(): Promise<void> {
    const authorized: boolean = await firstValueFrom(this.confirmService.confirm(confirmActionModal));
    if (!authorized) return;

    if (this.form.invalid) return;

    const formData = new FormData();

    const imagesSelected: Photo[] = this.imageHandler.getImages();

    console.log(imagesSelected.length);

    if (imagesSelected.length > 1) {
      console.warn('Error: more than one image selected for user profile');
      return;
    }

    this.imageHandler.getImages()
      .filter((image: Photo) => image.file)
      .forEach((image: Photo) => formData.append('photo', image.file as Blob));

    const data: any = this.form.getRawValue();

    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('phoneNumber', data.phoneNumber);
    formData.append('licenseNumber', data.licenseNumber);
    formData.append('specialtyLicense', data.specialtyLicense);
    formData.append('specialty', JSON.stringify(data.specialty));
    formData.append('requireAnticipatedCardPayments', data.requireAnticipatedCardPayments.toString());

    this.accountService.updateAccountDetails(formData).subscribe({
      next: (_: Account) => {
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
