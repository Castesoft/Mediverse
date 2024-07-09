import { Component } from "@angular/core";

@Component({
  host: { class: 'badge bg-phoenix-success bg-success', },
  selector: 'new-badge, span[newBadge]',
  template: `NUEVO`,
  standalone: true,
})
export class NewBadgeComponent {}
