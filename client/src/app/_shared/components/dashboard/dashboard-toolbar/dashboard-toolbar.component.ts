import { Component, input, InputSignal } from '@angular/core';
import { BreadcrumbsComponent } from "src/app/_shared/components/breadcrumbs.component";

@Component({
  selector: 'dashboard-toolbar',
  templateUrl: './dashboard-toolbar.component.html',
  styleUrl: './dashboard-toolbar.component.scss',
  imports: [
    BreadcrumbsComponent
  ],
})
export class DashboardToolbarComponent {
  label: InputSignal<string> = input.required();
}
