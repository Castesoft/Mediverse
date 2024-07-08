import { Component, OnInit, inject } from '@angular/core';
import { PrescriptionFormComponent } from './prescription-form.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ControlDateComponent } from '../../_forms/form-control-datepicker.component';
import { InputControlComponent } from '../../_forms/form-control.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { PatientSelectModalComponent } from '../../patients/components/patient-select-modal.component';
import { PatientsSelectModalService } from '../../patients/components/patient-select-modal.service';
import { Patient } from '../../_models/patient';
import { AlertModule } from 'ngx-bootstrap/alert';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsService } from '../../_services/icons.service';
import { PatientsService } from '../../_services/data/patients.service';
import { MedicinesService } from '../../_services/data/medicines.service';
import { Medicine } from '../../_models/medicine';
import { MedicineSelectModalComponent } from '../../medicines/components/medicine-select-modal.component';
import { MedicinesSelectModalService } from '../../medicines/components/medicine-select-modal.service';
import { AccountService } from '../../_services/accounts.service';

@Component({
  selector: '[prescriptionsNew]',
  templateUrl: './prescription-new.component.html',
  standalone: true,
  imports: [
    FontAwesomeModule,
    AlertModule,
    ReactiveFormsModule,
    RouterModule,
    InputControlComponent,
    ControlDateComponent,
  ],
})
export class PrescriptionNewComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalService = inject(PatientsSelectModalService);
  private modalServiceMedicines = inject(MedicinesSelectModalService);
  private bsModalService = inject(BsModalService);
  public icons = inject(IconsService);
  private medicinesService = inject(MedicinesService);
  private patientsService = inject(PatientsService);
  private accountsService = inject(AccountService);

  modalRef: BsModalRef<PatientSelectModalComponent> =
    new BsModalRef<PatientSelectModalComponent>();
  modalRefMedicines: BsModalRef<MedicineSelectModalComponent> =
    new BsModalRef<MedicineSelectModalComponent>();

  formGroup: FormGroup = new FormGroup({});

  disablePatientSelect = false;
  patientSelected = false;
  selectedPatientIsValid = true;
  patientSelectionErrors: string[] = [];
  patient: Patient | null = null;

  prescriptionInformation: any = null;
  account: any = null;

  medicines: Medicine[] = [];

  constructor() {}

  ngOnInit(): void {
    this.initForm();
    this.subscribeToSelectedPatient();
    this.subscribeToSelectedMedicines();
    this.subscribeToCurrentAccount();
  }

  private subscribeToSelectedPatient() {
    this.patientsService.selected$.subscribe((patient) => {
      this.patient = patient;
      this.patientSelected = !!patient;
      this.selectedPatientIsValid = !!patient;
      this.patientSelectionErrors = [];
    });
  }

  private subscribeToCurrentAccount() {
    this.accountsService.current$.subscribe((account) => {
      console.log(account);
      if (account) {
        this.account = account;
        console.log(account);
        this.getInfo(account.id);
      } else {
        this.getInfo(1);
      }
    });
  }

  private getInfo(id: number) {
    this.patientsService.getPrescriptionInformation(id).subscribe((info: any) => {

      this.prescriptionInformation = info;
    });
  }

  private subscribeToSelectedMedicines() {
    this.medicinesService.multipleSelected$.subscribe((medicines) => {
      this.medicines = medicines;
    });
  }

  private initForm() {
    this.formGroup = this.fb.group({
      patient: '',
      date: '',
      medicines: this.fb.array([
        this.fb.group({
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
        }),
      ]),
      notes: '',
    });
  }

  openPatientSelectModal($event: Event): void {
    $event.preventDefault();
    this.modalRef = this.bsModalService.show(
      PatientSelectModalComponent,
      this.modalService.getConfig('awdawdawd')
    );
  }

  openMedicinesSelectModal($event: Event): void {
    $event.preventDefault();
    this.modalRefMedicines = this.bsModalService.show(
      MedicineSelectModalComponent,
      this.modalServiceMedicines.getConfig('multiselect', 'wwwwwwwwwwwwwwww')
    );
  }

  onSubmit() {
    console.log(this.formGroup.value);
  }
}
