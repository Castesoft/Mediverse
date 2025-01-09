import { Component, model, ModelSignal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CdkModule } from "../../../_shared/cdk.module";
import { MaterialModule } from "../../../_shared/material.module";
import { TableMenu } from "../../../_models/tables/extensions/tableComponentExtensions";
import { EventsService } from "../../events.config";
import { ITableMenu } from "../../../_models/tables/interfaces/tableComponentInterfaces";
import Event from "../../../_models/events/event";

@Component({
  selector: 'div[eventsTableMenu]',
  templateUrl: './events-table-menu.component.html',
  standalone: true,
  imports: [ RouterModule, CdkModule, MaterialModule ],
})
export class EventsTableMenuComponent extends TableMenu<EventsService> implements ITableMenu<Event> {
  item: ModelSignal<Event> = model.required();
  key: ModelSignal<string | null> = model.required();

  constructor() {
    super(EventsService);
  }
}
