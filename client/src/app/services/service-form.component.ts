import { Component, effect, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { Service } from "src/app/_models/services/service";
import { ServiceParams } from "src/app/_models/services/serviceParams";
import { ServiceFiltersForm } from "src/app/_models/services/serviceFiltersForm";
import { ServiceForm } from "src/app/_models/services/serviceForm";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { View } from "src/app/_models/base/types";
import { ServicesService } from "src/app/services/services.config";
import { FormUse } from "src/app/_models/forms/formTypes";
import { SubmitOptions } from "src/app/_utils/serviceHelper/types/submitOptions";

@Component({
  selector: "[serviceForm]",
  templateUrl: './service-form.component.html',
  imports: [ CommonModule, RouterModule, ControlsModule, Forms2Module, ]
})
export class ServiceFormComponent extends BaseForm<Service, ServiceParams, ServiceFiltersForm, ServiceForm, ServicesService> implements FormInputSignals<Service> {
  protected readonly FormUse: typeof FormUse = FormUse;

  item: ModelSignal<Service | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(ServicesService, ServiceForm);

    effect(() => {
      this.form.setUse(this.use());

      const value: Service | null = this.item();
      if (value !== null) {
        this.form.patchValue(value);
      }
    });
  }

  handleSubmission(): void {
    const submitOptions: SubmitOptions = {
      redirectUrl: 'inicio/servicios',
      useIdAfterResponseForRedirect: true,
      toastMessage: '¡Servicio creado con éxito!',
    }

    this.onSubmit(this.view, this.use, submitOptions);
  }
}
