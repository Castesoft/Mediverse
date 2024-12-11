import { Component, input, HostBinding } from "@angular/core";
import { RouterModule } from "@angular/router";


@Component({
  selector: 'li[breadcrumbLink]',
  template: `
  @if(!active() && url() && label()) {
    <a class="text-muted text-hover-primary" [routerLink]="[url()]">{{label()}}</a>
  } @else { {{label()}} }
  `,
  standalone: true,
  imports: [RouterModule,]
})
export class BreadcrumbLinkComponent {
  label = input.required<string>();
  url = input<string | undefined>(undefined);
  active = input<boolean>(false);

  @HostBinding('class') get hostClasses() {
    return this.active() ? 'breadcrumb-item text-gray-900' : 'breadcrumb-item text-muted';
  }
}
