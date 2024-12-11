import { Component, inject, HostBinding } from "@angular/core";
import { UtilsService } from "src/app/_services/utils.service";


// wrapper

@Component({
  host: { class: 'wrapper d-flex flex-column flex-row-fluid' },
  selector: 'div[wrapper]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class WrapperComponent {
  utilsService = inject(UtilsService);

  @HostBinding('style') get paddingStyle() {
    return this.utilsService.sidebarCollapsed() ? 'padding-left: 40px;' : '';
  }
}
