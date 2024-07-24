import { Component, inject, input } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { IconsService } from "src/app/_services/icons.service";
import { RouterLink } from "@angular/router";
import { CatalogMode, View } from 'src/app/_models/types';
import { PrescriptionsService } from 'src/app/_services/prescriptions.service';
import { FilterForm, Prescription, PrescriptionParams } from 'src/app/_models/prescription';
import { Pagination } from 'src/app/_models/pagination';
import { Subject } from 'rxjs';

@Component({
  host: { class: 'pb-6', },
  selector: 'div[prescriptionsCatalog]',
  templateUrl: 'prescriptions-catalog.component.html',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink
  ]
})
export class PrescriptionsCatalogComponent {
  service = inject(PrescriptionsService);
  icons = inject(IconsService);

  key = input.required<string>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();

  data?: Prescription[];
  params!: PrescriptionParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();
}
