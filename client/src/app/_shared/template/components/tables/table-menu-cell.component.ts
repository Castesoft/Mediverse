import { Component, inject, input, TemplateRef, model, effect } from "@angular/core";
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
  imports: [MaterialModule, CdkModule, FontAwesomeModule],
})
export class TableMenuCellComponent {
  icons = inject(IconsService);

  contextMenu = input.required<TemplateRef<any>>();
  item = model.required<Entity>();
  isCompact = model.required<boolean>();

  constructor() {
    effect(() => {

    });
  }
}
