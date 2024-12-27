import { Component } from '@angular/core';

@Component({
  host: { class: '', },
  selector: 'div[adminRoute]',
  template: `
  <nav mainSidebar>
    <router-outlet></router-outlet>
  </nav>
  `,
  standalone: false,
})
export class AdminComponent {}
