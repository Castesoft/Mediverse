import { Component, HostBinding, input, InputSignal } from "@angular/core";
import { RouterModule } from "@angular/router";


@Component({
  selector: 'li[breadcrumbLink]',
  template: `
    @if (!active() && url() && label()) {
      <a class="text-muted text-hover-primary" [routerLink]="[url()]">{{ label() }}</a>
    } @else {
      {{ label() }}
    }
  `,
  standalone: true,
  imports: [ RouterModule, ]
})
export class BreadcrumbLinkComponent {
  label: InputSignal<string> = input.required();
  url: InputSignal<string | undefined> = input();
  active: InputSignal<boolean> = input(false);

  @HostBinding('class') get hostClasses() {
    return this.active() ? 'breadcrumb-item text-gray-900' : 'breadcrumb-item text-muted';
  }
}
