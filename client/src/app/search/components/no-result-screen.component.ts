import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  host: { class: 'd-flex flex-column align-items-center justify-content-center pb-6 container', },
  selector: 'div[noResultScreen]',
  templateUrl: './no-result-screen.component.html',
  standalone: true,
  imports: [ CommonModule, ],
})
export class NoResultScreenComponent {
  
}
