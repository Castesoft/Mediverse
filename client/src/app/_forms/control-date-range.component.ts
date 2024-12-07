import { Component, inject, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { createId } from '@paralleldrive/cuid2';
import { EntityParams } from 'src/app/_models/base/entityParams';
import { Form } from 'src/app/_models/forms/deprecated/form';
import { ValidationService } from 'src/app/_services/validation.service';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';

@Component({
  host: { class: 'w-100' },
  selector: 'div[controlDateRange]',
  template: `
    @if (form()) {
      <mat-form-field [appearance]="'outline'" class="hide-bottom w-100">
        <mat-label>Rango de fechas</mat-label>
        <mat-date-range-input
          [rangePicker]="picker"
          [formGroup]="form()!.group"
          (click)="picker.open()"
          [id]="id"
        >
          <input
            matStartDate
            [id]="form()!.controls['dateFrom'].id"
            [formControlName]="form()!.controls['dateFrom'].name"
            [placeholder]="form()!.controls['dateFrom'].placeholder"
          />
          <input
            matEndDate
            [id]="form()!.controls['dateTo'].id"
            [formControlName]="form()!.controls['dateTo'].name"
            [placeholder]="form()!.controls['dateTo'].placeholder"
          />
        </mat-date-range-input>
        <mat-datepicker-toggle
          matIconSuffix
          [for]="picker"
        ></mat-datepicker-toggle>
        <mat-date-range-picker #picker></mat-date-range-picker>
      </mat-form-field>
    }
  `,
  standalone: true,
  imports: [MaterialModule, CdkModule, FormsModule, ReactiveFormsModule],
  providers: [provideNativeDateAdapter()],
})
export class ControlDateRangeComponent {
  validation = inject(ValidationService);

  form = model.required<Form<any extends EntityParams<any> ? any : any>>();
  id = createId();

  constructor() {}
}
