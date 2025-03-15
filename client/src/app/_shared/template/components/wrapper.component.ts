import { Component, HostBinding, inject } from "@angular/core";
import { MobileQueryService } from 'src/app/_services/mobile-query.service';
import { SidebarService } from 'src/app/_services/sidebar.service';

@Component({
  host: { class: 'd-flex flex-column flex-row-fluid h-100', id: 'kt_wrapper' },
  selector: 'div[wrapper]',
  template: '<ng-content></ng-content>'
})
export class WrapperComponent {
  readonly sidebar: SidebarService = inject(SidebarService);
  readonly query: MobileQueryService = inject(MobileQueryService);

  @HostBinding('style') get paddingStyle() {
    if (this.query.isMobile()) {
      return 'padding-left: 0px; padding-right: 0px;';
    } else {
      return 'padding-left: 40px; ';
    }
  }
}
