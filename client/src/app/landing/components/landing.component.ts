import { Component, HostListener } from '@angular/core';
import { SearchGeneralComponent } from "../../search/components/search-general/search-general.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [SearchGeneralComponent],
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
