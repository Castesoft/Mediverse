import { Component } from "@angular/core";


@Component({
  host: { class: 'position-absolute bg-success rounded-circle border border-4 border-body h-20px w-20px', style: 'bottom: -5px; right: -5px;', },
  selector: 'div[onlineBadge]',
  template: ``,
  standalone: true,
})
export class OnlineBadgeComponent {
}
