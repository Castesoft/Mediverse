import { Component } from '@angular/core';
import { HeaderComponent } from "src/app/_shared/template/components/headers/header.component";
import { RouterOutlet } from "@angular/router";

@Component({
  host: { class: 'd-flex flex-column flex-root h-100' },
  selector: 'dashboard-main-route',
  imports: [
    HeaderComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {

}
