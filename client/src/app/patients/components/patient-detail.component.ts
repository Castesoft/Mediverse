import { CommonModule } from "@angular/common";
import { Component, model, ModelSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseDetail from "src/app/_models/base/components/extensions/baseDetail";
import { View } from "src/app/_models/base/types";
import { DetailInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { Patient } from "src/app/_models/patients/patient";
import { PatientFiltersForm } from "src/app/_models/patients/patientFiltersForm";
import { PatientParams } from "src/app/_models/patients/patientParams";
import { PatientFullDetailComponent } from "src/app/patients/components/utils/patient-full-detail.component";
import { PatientFormComponent, PatientsService } from "src/app/patients/patients.config";


@Component({
  selector: 'div[patientDetail]',
  template: `
    @if (item() !== null && use() === 'detail') {
      <div patientFullDetail
           [(item)]="item"
           [(key)]="key"
           [(use)]="use"
           [(view)]="view"
           [(title)]="title"></div>
    } @else if (use() === 'edit' || use() === 'create') {
      <div patientForm
           [(item)]="item"
           [(key)]="key"
           [(use)]="use"
           [(view)]="view"></div>
    }
  `,
  imports: [
    PatientFormComponent,
    ControlsModule,
    Forms2Module,
    RouterModule,
    CommonModule,
    PatientFullDetailComponent,
  ],
})
export class PatientDetailComponent extends BaseDetail<Patient, PatientParams, PatientFiltersForm, PatientsService> implements DetailInputSignals<Patient> {
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  item: ModelSignal<Patient | null> = model.required();
  key: ModelSignal<string | null> = model.required();
  title: ModelSignal<string | null> = model.required();

  constructor() {
    super(PatientsService);
  }
}
