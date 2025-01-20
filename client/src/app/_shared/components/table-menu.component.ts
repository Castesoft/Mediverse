import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core";
import { CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { FormUse } from "src/app/_models/forms/formTypes";

@Component({
  selector: "div[tableMenu]",
  templateUrl: "./table-menu.component.html",
  standalone: true,
  imports: [ CdkMenu, CdkMenuItem ]
})
export class TableMenuComponent<T extends Entity, P extends EntityParams<P>, F extends FormGroup2<P>, Z extends ServiceHelper<T, P, F>> {
  key: InputSignal<string> = input.required();
  service: InputSignal<Z> = input.required();
  item: InputSignal<T> = input.required();
  siteSection: InputSignal<SiteSection | undefined> = input();

  downloadClicked: OutputEmitterRef<void> = output<void>();
  printClicked: OutputEmitterRef<void> = output<void>();
  protected readonly FormUse = FormUse;
}
