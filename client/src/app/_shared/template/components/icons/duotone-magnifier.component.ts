import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  host: { class: 'ki-duotone ki-magnifier fs-3 position-absolute ms-4', },
  selector: 'i[duotoneMagnifier]',
  template: `
    <span class="path1"></span>
    <span class="path2"></span>
  `,
  imports: [ CommonModule, ],
  standalone: true,
})
export class DuotoneMagnifierComponent {}
