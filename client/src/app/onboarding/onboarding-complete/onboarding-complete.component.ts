import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  host: { class: 'd-flex flex-column h-100 w-100 justify-content-center align-items-center' },
  selector: 'app-onboarding-complete',
  templateUrl: './onboarding-complete.component.html',
  imports: [
    RouterLink
  ],
  styleUrl: './onboarding-complete.component.scss'
})
export class OnboardingCompleteComponent {

}
