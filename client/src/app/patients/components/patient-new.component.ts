import { Component, OnInit, inject } from '@angular/core';
import { PatientFormComponent } from './patient-form.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ControlDateComponent } from '../../_forms/form-control-datepicker.component';
import { InputControlComponent } from '../../_forms/form-control.component';

@Component({
  selector: '[patientsNew]',
  templateUrl: './patient-new.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, InputControlComponent, ControlDateComponent ],
})
export class PatientNewComponent implements OnInit {
  private fb = inject(FormBuilder);

  formGroup: FormGroup = new FormGroup({});

  constructor() {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.formGroup = this.fb.group({
      patient: '',
      date: '',
      patients: this.fb.array([
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

  onSubmit() {
    console.log(this.formGroup.value);
  }
}

