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
import { SubscriptionHistory } from "src/app/_models/subscriptionHistories/subscriptionHistory";
import { SubscriptionHistoryParams } from "src/app/_models/subscriptionHistories/subscriptionHistoryParams";
import { SubscriptionHistoryFiltersForm } from "src/app/_models/subscriptionHistories/subscriptionHistoryFiltersForm";
import { SubscriptionHistoryForm } from "src/app/_models/subscriptionHistories/subscriptionHistoryForm";
import { SubscriptionHistoriesService } from "src/app/subscriptionHistories/subscriptionHistory.config";

@Component({
  selector: "[subscriptionHistoryForm]",
  templateUrl: './subscriptionHistory-form.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
  ]
})
export class SubscriptionHistoryFormComponent extends BaseForm<SubscriptionHistory, SubscriptionHistoryParams, SubscriptionHistoryFiltersForm, SubscriptionHistoryForm, SubscriptionHistoriesService> implements FormInputSignals<SubscriptionHistory> {
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly FormUse: typeof FormUse = FormUse;

  item: ModelSignal<SubscriptionHistory | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  constructor() {
    super(SubscriptionHistoriesService, SubscriptionHistoryForm);

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
