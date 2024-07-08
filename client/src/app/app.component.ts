import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  host: { class: 'h-100' },
  template: `
    <router-outlet></router-outlet>

    <div scrolltop></div>
    <div formErrorModal></div>
  `,
})
export class AppComponent {

  constructor() {
    
  }

}
