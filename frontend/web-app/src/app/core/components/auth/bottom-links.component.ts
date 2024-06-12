import { Component } from '@angular/core';

@Component({
  selector: '[bottomLinks]',
  template: `
    <div class="d-flex flex-center fw-semibold fs-6">
      <a
        [routerLink]="[]"
        class="text-muted text-hover-primary px-2"
        target="_blank"
        >About</a
      >

      <a
        [routerLink]="[]"
        class="text-muted text-hover-primary px-2"
        target="_blank"
        >Support</a
      >

      <a
        [routerLink]="[]"
        class="text-muted text-hover-primary px-2"
        target="_blank"
        >Purchase</a
      >
    </div>
  `,
})
export class BottomLinksComponent {}
