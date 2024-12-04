import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, signal } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormNewModule } from "src/app/_forms/_new/forms-new.module";
import { Account } from "src/app/_models/account";
import { InsuranceForm } from "src/app/_models/insurance";
import { BadRequest, FormUse, View } from "src/app/_models/types";
import { UserMedicalInsuranceCompany } from "src/app/_models/userMedicalInsuranceCompany";
import { AccountService } from "src/app/_services/account.service";
import { InsuranceDocumentItemComponent } from "src/app/account/utils/insurance-document-item.component";
import { MedicalInsuranceCompaniesService } from "src/app/medicalInsuranceCompanies/medicalInsuranceCompanies.config";

@Component({
  selector: 'div[userInsuranceDetail]',
  templateUrl: './user-insurance-detail.component.html',
  standalone: true,
  imports: [ FormNewModule, CommonModule, InsuranceDocumentItemComponent ],
})
export class UserInsuranceDetailComponent {
  service = inject(AccountService);

  private snackBar = inject(MatSnackBar);
  private matDialog = inject(MatDialog);
  private medicalInsuranceCompanies = inject(MedicalInsuranceCompaniesService);

  view = model.required<View>();
  use = model.required<FormUse>();
  item = model.required<UserMedicalInsuranceCompany | null>();

  form = new InsuranceForm();

  account = signal<Account | null>(null);

  constructor() {
    this.medicalInsuranceCompanies.getOptions().subscribe();

    effect(() => {
      const value = this.item();
      this.form.controls.medicalInsuranceCompany.selectOptions = this.medicalInsuranceCompanies.options();
      this.account.set(this.service.current());

      if (value) {
        this.form.patchValue(value as any);
      }

      this.form.setUse(this.use());
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
    this.service.addMedicalInsurance(this.form.payload).subscribe({
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
    this.service.updateMedicalInsurance(this.form.payload).subscribe({
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
