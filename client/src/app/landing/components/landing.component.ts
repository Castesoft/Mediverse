import { Component, HostListener } from '@angular/core';
import { SearchGeneralComponent } from "../../search/components/search-general/search-general.component";
import { RouterLink } from '@angular/router';
import { SignInBasicFormComponent } from 'src/app/auth/components/sign-in-basic-form.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SearchGeneralComponent, RouterLink, SignInBasicFormComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  hideBackground = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.hideBackground = window.pageYOffset > 10;
  }
}
