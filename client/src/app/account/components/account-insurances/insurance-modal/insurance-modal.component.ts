import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { MedicalInsuranceCompany, UserMedicalInsuranceCompany } from 'src/app/_models/medicalInsuranceCompany';
import { AccountService } from 'src/app/_services/account.service';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';

@Component({
  selector: 'app-insurance-modal',
  standalone: true,
  imports: [ModalWrapperModule, ReactiveFormsModule, ControlSelectComponent, InputControlComponent],
  templateUrl: './insurance-modal.component.html',
  styleUrl: './insurance-modal.component.scss'
})
export class InsuranceModalComponent {
  private fb = inject(FormBuilder);
  accountService = inject(AccountService);

  bsModalRef = inject(BsModalRef);
  title?: string;
  type: 'add' | 'edit' = 'add';
  insurance: UserMedicalInsuranceCompany | null = null;
  companies: MedicalInsuranceCompany[] = [];
  insuranceFile: File | null = null;

  submitted = false;
  insuranceForm = this.fb.group({
    MedicalInsuranceCompanyId     : [ '', [Validators.required] ],
    PolicyNumber                  : [ '', [Validators.required] ],
    IsMain                        : [ false, [Validators.required] ],
    file                          : [ null, [Validators.required] ],
  });

  ngOnInit() {
    this.accountService.getMedicalInsuranceCompaniesFields();

    if (this.type === 'edit' && this.insurance) {
      this.insuranceForm.get('MedicalInsuranceCompanyId')?.setValue(this.insurance.id.toString());
      this.insuranceForm.get('PolicyNumber')?.setValue(this.insurance.policyNumber);
      this.insuranceForm.get('IsMain')?.setValue(this.insurance.isMain);
      if (this.insurance.isMain) {
        this.insuranceForm.get('IsMain')?.disable();
      }
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.insuranceFile = event.target.files[0];
    }
  }

  onSubmit() {
    this.submitted = true;

    if (!this.insuranceForm.valid) {
      return;
    }

    if (this.type === 'add') {
      this.accountService.addMedicalInsurance(this.insuranceForm.value).subscribe({
        next: () => {
          this.bsModalRef.hide();
          this.submitted = false;
        },
        error: () => {
          this.submitted = false;
        }
      });
    } else {
      if (!this.insurance) return;
      this.insuranceForm.get('IsMain')?.enable();
      this.accountService.updateMedicalInsurance(this.insurance.id, this.insuranceForm.value).subscribe({
        next: () => {
          this.bsModalRef.hide();
          this.submitted = false;
        },
        error: () => {
          this.submitted = false;
        }
      });
    }
  }
}
