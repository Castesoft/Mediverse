import { CommonModule } from "@angular/common";
import { Component, inject, model, signal, effect } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { Account } from "src/app/_models/account/account";
import { View } from "src/app/_models/base/types";
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { FormUse } from "src/app/_models/forms/formTypes";
import { MedicalLicense } from 'src/app/_models/medicalLicenses/medicalLicense';
import { MedicalLicenseForm } from 'src/app/_models/medicalLicenses/medicalLicenseForm';
import { AccountService } from "src/app/_services/account.service";
import { InsuranceDocumentItemComponent } from "src/app/account/utils/insurance-document-item.component";
import { SpecialtiesService } from 'src/app/specialties/specialties.config';

@Component({
  selector: 'div[medicalLicenseDetail]',
  templateUrl: './medical-license-detail.component.html',
  standalone: true,
  imports: [ Forms2Module, CommonModule, InsuranceDocumentItemComponent ],
})
export class MedicalLicenseDetailComponent {
  service = inject(AccountService);

  private readonly matDialog = inject(MatDialog);
  private readonly specialties = inject(SpecialtiesService);

  view = model.required<View>();
  use = model.required<FormUse>();
  item = model.required<MedicalLicense | null>();

  form = new MedicalLicenseForm();

  account = signal<Account | null>(null);

  constructor() {

    this.specialties.getOptions().subscribe();

    effect(() => {
      const value = this.item();
      this.account.set(this.service.current());

      if (value) {
        this.form.patchValue(value as any);
      }

      this.form
        .setUse(this.use())
        .setSpecialtyOptions(this.specialties.options())
      ;

    });
  }

  onSubmit() {
    this.form.submitted = true;
    this.form.updateValueAndValidity();
    this.form.loading = true;

    switch (this.use()) {
      case 'create':
        this.create();
        break;
      case 'edit':
        this.update();
        break;
    }
  }

  create() {
    this.service.addMedicalLicense(this.form.payload).subscribe({
      next: response => {
        this.form.submitted = false;
      },
      error: (error: BadRequest) => {
        this.form.error = error;
      },
      complete: () => {
        this.form.loading = false;
        this.matDialog.closeAll();
      }
    });
  }

  update() {

    const medicalLicenseId = this.form.controls.id.getRawValue();

    if (medicalLicenseId === null || medicalLicenseId === undefined) {
      throw new Error('MedicalLicenseDetailComponent.update: id is required');
    }

    this.service.updateMedicalLicense(this.form.payload, medicalLicenseId).subscribe({
      next: response => {
        this.form.submitted = false;
      },
      error: (error: BadRequest) => {
        this.form.error = error;
      },
      complete: () => {
        this.form.loading = false;
        this.matDialog.closeAll();
      }
    });
  }

}
