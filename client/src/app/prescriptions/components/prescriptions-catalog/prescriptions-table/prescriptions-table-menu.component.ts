import { Component, model, ModelSignal, output, OutputEmitterRef } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { TableMenu } from "src/app/_models/tables/extensions/tableComponentExtensions";
import { PrescriptionsService } from "src/app/prescriptions/prescriptions.config";
import { ITableMenu } from "src/app/_models/tables/interfaces/tableComponentInterfaces";
import { Prescription } from "src/app/_models/prescriptions/prescription";

@Component({
  selector: '[prescriptionsTableMenu]',
  templateUrl: './prescriptions-table-menu.component.html',
  standalone: true,
  imports: [ RouterModule, CdkModule, MaterialModule ],
})
export class PrescriptionsTableMenuComponent extends TableMenu<PrescriptionsService> implements ITableMenu<Prescription> {
  item: ModelSignal<Prescription> = model.required();
  key: ModelSignal<string | null> = model.required();

  printClicked: OutputEmitterRef<void> = output<void>();
  downloadClicked: OutputEmitterRef<void> = output<void>();

  constructor() {
    super(PrescriptionsService);
  }
}
