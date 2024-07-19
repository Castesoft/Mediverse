import {Component, inject, input, model, OnInit} from "@angular/core";
import {Address} from "../_models/address";
import {RouterLink} from "@angular/router";
import {Subject} from "rxjs";
import {AddressesService} from "../_services/addresses.service";
import {IconsService} from "../_services/icons.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'div[clinicSummaryCard]',
  templateUrl: 'clinic-summary-card.component.html',
  standalone: true,
  imports: [
    RouterLink,
    FaIconComponent
  ]
})
export class ClinicSummaryCardComponent implements OnInit {
  private clinicsService = inject(AddressesService);
  private ngUnsubscribe = new Subject<void>();
  icons = inject(IconsService);

  title = input<string>();
  key = input.required<string>();
  item = model.required<Address>();
  showEdit = input<boolean>(false);

  ngOnInit(): void {
    this.subscribeToSelectedClinic(this.key());
  }

  private subscribeToSelectedClinic = (key: string) => {
    this.clinicsService.selected$(key).subscribe((clinic) => {
      if (clinic) {
        this.item.set(clinic);
      }
    });
  }

  generateMapsUrl(address: Address): string {
    const baseUrl = 'https://maps.google.com/?q=';
    const fullAddress = `${address.street}, ${address.exteriorNumber}${address.interiorNumber ? ', ' + address.interiorNumber : ''}`;
    return baseUrl + encodeURIComponent(fullAddress);
  }
}
