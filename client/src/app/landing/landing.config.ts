import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'landing-route',
  template: `
    <router-outlet></router-outlet>
  `,
  imports: [ CommonModule, RouterModule ],
})
export class LandingRouterComponent {
  showNavbar: boolean = true;
  isLightBackground: boolean = false;

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showNavbar = !event.url.includes('/search');
        this.isLightBackground =
          event.url.includes('/services') ||
          event.url.includes('/pricing') ||
          event.url.includes('/doctor');
      }
    });
  }
}


