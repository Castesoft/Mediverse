import { Component } from '@angular/core';
import { LandingNavbarComponent } from "src/app/landing/components/landing-navbar/landing-navbar.component";
import { LandingFooterComponent } from "src/app/landing/components/landing-footer/landing-footer.component";

@Component({
  selector: 'app-contact',
  imports: [
    LandingNavbarComponent,
    LandingFooterComponent
  ],
  templateUrl: './contact.component.html',
  styleUrl: '../../components/landing.component.scss'
})
export class ContactComponent {

}
