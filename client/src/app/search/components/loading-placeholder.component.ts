import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  host: { class: 'flex-grow-1 d-flex flex-column justify-content-center align-items-center', },
  selector: 'div[loadingPlaceholder]',
  templateUrl: './loading-placeholder.component.html',
  standalone: true,
  imports: [ CommonModule, ],
})
export class LoadingPlaceholderComponent {
  
}
