import { Component, effect, input, InputSignal, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { Doctor } from "src/app/_models/doctors/doctor";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { View } from "src/app/_models/base/types";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { DoctorsService } from "src/app/doctors/doctors.config";

@Component({
  selector: "[doctorForm]",
  templateUrl: './doctor-form.component.html',
  standalone: true,
  imports: [ CommonModule, RouterModule, ControlsModule, Forms2Module, ]
})
export class DoctorFormComponent extends BaseForm<Doctor, DoctorParams, DoctorFiltersForm, DoctorForm, DoctorsService> implements FormInputSignals<Doctor> {
  item: ModelSignal<Doctor | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  constructor() {
    super(DoctorsService, DoctorForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item() !== null) this.form.patchValue(this.item()!);
    });
  }
}
