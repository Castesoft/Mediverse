import { Component, effect, inject, input, InputSignal, model, ModelSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { ControlsModule } from "src/app/_forms/controls.module";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { Doctor } from "src/app/_models/doctors/doctor";
import { FormUse } from "src/app/_models/forms/formTypes";
import { CatalogMode, View } from "src/app/_models/base/types";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { doctorFormInfo } from "src/app/_models/doctors/doctorConstants";
import { ValidationService } from "src/app/_services/validation.service";
import { SymbolCellComponent } from "src/app/_shared/template/components/tables/cells/symbol-cell.component";
import { PhotoShape, PhotoSize } from "src/app/_models/photos/photoTypes";
import { CollapseDirective } from "ngx-bootstrap/collapse";
import { ClinicsCatalogComponent } from "src/app/clinics/components/clinics-catalog.component";
import Clinic from "src/app/_models/clinics/clinic";
import { createId } from "@paralleldrive/cuid2";
import ClinicParams from "src/app/_models/clinics/clinicParams";
import { SubscriptionsCatalogComponent } from "src/app/subscriptions/subscriptions-catalog.component";
import { Subscription } from "src/app/_models/subscriptions/subscription";
import { SubscriptionParams } from "src/app/_models/subscriptions/subscriptionParams";

@Component({
  selector: "[doctorForm]",
  templateUrl: './doctor-form.component.html',
  styleUrls: [ './doctor-form.component.scss' ],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ControlsModule,
    Forms2Module,
    SymbolCellComponent,
    CollapseDirective,
    ClinicsCatalogComponent,
    SubscriptionsCatalogComponent,
  ]
})
export class DoctorFormComponent {
  protected readonly PhotoSize: typeof PhotoSize = PhotoSize;
  protected readonly PhotoShape: typeof PhotoShape = PhotoShape;

  private readonly validation: ValidationService = inject(ValidationService);

  item: ModelSignal<Doctor | null> = model.required();
  use: ModelSignal<FormUse> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  useCard: InputSignal<boolean> = input(true);
  siteSection: InputSignal<SiteSection | undefined> = input();

  clinicItem: Clinic | null = null;
  clinicView: View = 'page';
  clinicKey: string = createId();
  clinicIsCompact: boolean = true;
  clinicEmbedded: boolean = true;
  clinicMode: CatalogMode = 'view';
  clinicParams: ClinicParams = new ClinicParams(this.clinicKey, { fromSection: SiteSection.ADMIN, doctorId: null });

  subscriptionItem: Subscription | null = null;
  subscriptionView: View = 'page';
  subscriptionKey: string = createId();
  subscriptionIsCompact: boolean = true;
  subscriptionEmbedded: boolean = true;
  subscriptionMode: CatalogMode = 'view';
  subscriptionParams: SubscriptionParams = new SubscriptionParams(this.subscriptionKey, { fromSection: SiteSection.ADMIN, doctorId: null });

  form: FormGroup2<Doctor> = new FormGroup2(Doctor, new Doctor, doctorFormInfo);
  isCollapsed: boolean = false;

  activeTab: string = 'payments';
  onSelectTab: (tab: string) => string = (tab: string) => this.activeTab = tab;

  constructor() {
    effect(() => {
      this.form
        .setUse(this.use())
        .setValidation(this.validation.active());

      if (this.item() !== null && this.clinicParams.doctorId === null && this.subscriptionParams.doctorId === null) {
        this.clinicParams.doctorId = this.item()!.id;
        this.subscriptionParams.doctorId = this.item()!.id;
        this.form.patchValue(this.item()!);
      }
    });
  }

  onSubmit(view: View, use: FormUse) {
    console.error('not implemented');
  }
}
