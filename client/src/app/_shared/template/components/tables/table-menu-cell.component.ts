import { Component, inject, input, TemplateRef, model, HostBinding, effect } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Entity } from "src/app/_models/base/entity";
import { IconsService } from "src/app/_services/icons.service";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";


@Component({
  selector: 'td[tableMenuCell]',
  // template: ``,
  templateUrl: './table-menu-cell.component.html',
  standalone: true,
  imports: [MaterialModule, CdkModule, FontAwesomeModule],
})
export class TableMenuCellComponent {
  icons = inject(IconsService);

  contextMenu = input.required<TemplateRef<any>>();
  item = model.required<Entity>();
  isCompact = model.required<boolean>();

  class = 'align-middle white-space-nowrap text-end pe-0 btn-reveal-trigger text-center';

  @HostBinding('class') get hostClasses() {
    return this.class;
  }

  constructor() {
    effect(() => {
      this.class = `${this.class} py-1 fs-6 pe-3 ps-1 border-none`;
    });
  }
}
