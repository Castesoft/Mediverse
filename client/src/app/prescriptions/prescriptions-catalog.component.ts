import { Component, inject } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'div[prescriptionsCatalog]',
  templateUrl: 'prescriptions-catalog.component.html',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink
  ]
})
export class PrescriptionsCatalogComponent {
  icons = inject(IconsService);
}
