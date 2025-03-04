import { Component, inject, HostBinding } from "@angular/core";
import { MobileQueryService } from 'src/app/_services/mobile-query.service';
import { SidebarService } from 'src/app/_services/sidebar.service';

@Component({
  host: { class: 'wrapper d-flex flex-column flex-row-fluid h-100', id: 'kt_wrapper' },
  selector: 'div[wrapper]',
  template: `<ng-content></ng-content>`,
  standalone: true,
  styles: `
  :host {
    overflow: hidden!important;
  }
  `,
})
export class WrapperComponent {
  readonly sidebar = inject(SidebarService);
  readonly query = inject(MobileQueryService);

  @HostBinding('style') get paddingStyle() {

    if (this.query.isMobile() === true) {
      return 'padding-left: 0px; padding-right: 0px;';
    } else if (this.query.isMobile() === false) {
      if (this.sidebar.opened() === true) {
        return 'padding-left: 40px; ';
      } else if (this.sidebar.opened() === false) {
        return 'padding-left: 40px; ';
      }

    }

    return '';
  }
}
