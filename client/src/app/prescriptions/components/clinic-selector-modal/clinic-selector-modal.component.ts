import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService } from 'src/app/_services/account.service';
import { DoctorClinic } from 'src/app/_models/account';
import { ModalWrapperModule } from 'src/app/_shared/modal-wrapper.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-clinic-selector-modal',
  standalone: true,
  imports: [ModalWrapperModule, ReactiveFormsModule, CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title pull-left">{{ title }}</h4>
      <button type="button" class="btn-close close pull-right" aria-label="Close" (click)="bsModalRef.hide()">
        <span aria-hidden="true" class="visually-hidden">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <form [formGroup]="clinicForm" (ngSubmit)="onSubmit()">
        <div class="mb-3">
          <label for="clinic" class="form-label">Seleccionar Clínica</label>
          <select formControlName="clinicId" id="clinic" class="form-select">
            <option value="">Seleccione una clínica</option>
            <option *ngFor="let clinic of clinics" [value]="clinic.id">{{ clinic.street }}</option>
          </select>
        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-secondary me-2" (click)="bsModalRef.hide()">Cancelar</button>
          <button type="submit" class="btn btn-primary" [disabled]="!clinicForm.valid" (click)="onSubmit()">Seleccionar</button>
        </div>
      </form>
    </div>
  `
})
export class ClinicSelectorModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  
  bsModalRef = inject(BsModalRef);
  title?: string;
  clinics: DoctorClinic[] = [];
  onClinicSelected: (clinic: DoctorClinic) => void = () => {};

  clinicForm: FormGroup = this.fb.group({
    clinicId: ['', Validators.required]
  });

  ngOnInit() {
    this.clinics = this.accountService.current()?.doctorClinics || [];
  }

  onSubmit() {
    if (this.clinicForm.valid) {
      const selectedClinicId = this.clinicForm.get('clinicId')?.value;
      const selectedClinic = this.clinics.find(clinic => clinic.id === +selectedClinicId);
      if (selectedClinic) {
        this.onClinicSelected(selectedClinic);
        this.bsModalRef.hide();
      }
    }
  }
}