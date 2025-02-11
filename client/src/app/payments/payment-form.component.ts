import { Component, effect, input, InputSignal, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import BaseForm from "src/app/_models/base/components/extensions/baseForm";
import { FormInputSignals } from "src/app/_models/forms/formComponentInterfaces";
import { FormUse } from "src/app/_models/forms/formTypes";
import { View } from "src/app/_models/base/types";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { Payment } from "../_models/payments/payment";
import { PaymentParams } from "src/app/_models/payments/paymentParams";
import { PaymentFiltersForm } from "src/app/_models/payments/paymentFiltersForm";
import { PaymentsService } from "src/app/payments/payments.config";
import { PaymentForm } from "src/app/_models/payments/paymentForm";

@Component({
  selector: "[paymentForm]",
  templateUrl: './payment-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
  ]
})
export class PaymentFormComponent extends BaseForm<Payment, PaymentParams, PaymentFiltersForm, PaymentForm, PaymentsService> implements FormInputSignals<Payment> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  item: ModelSignal<Payment | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  constructor() {
    super(PaymentsService, PaymentForm);

    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item() !== null) {
        this.form.patchValue(this.item() as any);
      }
    });
  }
}
