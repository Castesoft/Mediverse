import { Component, input, InputSignal, output, OutputEmitterRef } from "@angular/core";
import { CdkMenu, CdkMenuItem } from "@angular/cdk/menu";
import { Entity } from "src/app/_models/base/entity";
import { EntityParams } from "src/app/_models/base/entityParams";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { ServiceHelper } from "src/app/_utils/serviceHelper/serviceHelper";
import { RouterLink } from "@angular/router";

@Component({
  selector: "div[tableMenu]",
  templateUrl: "./table-menu.component.html",
  standalone: true,
  imports: [ CdkMenu, CdkMenuItem, RouterLink ]
})
export class TableMenuComponent<T extends Entity, P extends EntityParams<P>, F extends FormGroup2<P>, Z extends ServiceHelper<T, P, F>> {
  key: InputSignal<string> = input.required();
  service: InputSignal<Z> = input.required();
  item: InputSignal<T> = input.required();

  downloadClicked: OutputEmitterRef<void> = output<void>();
  printClicked: OutputEmitterRef<void> = output<void>();
}
