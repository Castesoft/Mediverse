import { Component, inject, HostBinding } from "@angular/core";
import { SidebarService } from 'src/app/_services/sidebar.service';


// wrapper

@Component({
  host: { class: 'wrapper d-flex flex-column flex-row-fluid' },
  selector: 'div[wrapper]',
  template: `<ng-content></ng-content>`,
  standalone: true,
})
export class WrapperComponent {
  sidebar = inject(SidebarService);

  @HostBinding('style') get paddingStyle() {
    return this.sidebar.opened ? 'padding-left: 40px;' : '';
  }
}
