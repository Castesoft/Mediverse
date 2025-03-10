import { Component, inject, input, TemplateRef, model, ModelSignal, InputSignal, HostListener } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Entity } from "src/app/_models/base/entity";
import { IconsService } from "src/app/_services/icons.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";


@Component({
  host: { class: 'text-end pe-0', },
  selector: 'td[tableMenuCell]',
  templateUrl: './table-menu-cell.component.html',
  standalone: true,
  imports: [ MaterialModule, CdkModule, FontAwesomeModule ],
})
export class TableMenuCellComponent {
  icons: IconsService = inject(IconsService);

  contextMenu: InputSignal<TemplateRef<any>> = input.required<TemplateRef<any>>();
  item: ModelSignal<Entity> = model.required<Entity>();
  isCompact: ModelSignal<boolean> = model.required<boolean>();
  ellipsis: ModelSignal<boolean> = model(false);

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
