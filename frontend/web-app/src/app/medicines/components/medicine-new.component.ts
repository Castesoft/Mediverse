import { Component, OnInit, inject } from '@angular/core';
import { MedicineFormComponent } from './medicine-form.component';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ControlDateComponent } from '../../_forms/form-control-datepicker.component';
import { InputControlComponent } from '../../_forms/form-control.component';

@Component({
  selector: '[medicinesNew]',
  templateUrl: './medicine-new.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, InputControlComponent, ControlDateComponent ],
})
export class MedicineNewComponent implements OnInit {
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

  onSubmit() {
    console.log(this.formGroup.value);
  }
}

