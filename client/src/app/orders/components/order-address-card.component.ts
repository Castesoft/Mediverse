import { Component, input, InputSignal, computed, Signal } from "@angular/core";
import { Address } from "src/app/_models/addresses/address";

@Component({
  selector: 'div[orderAddressCard]',
  templateUrl: './order-address-card.component.html',
  standalone: true,
})
export class OrderAddressCardComponent {
  address: InputSignal<Address | null> = input.required();
  title: InputSignal<string> = input('Dirección');

  formattedStreetLine: Signal<string> = computed(() => {
    const addr: Address | null = this.address();
    if (!addr) return '';

    const parts: any[] = [];
    if (addr.street) parts.push(addr.street);
    if (addr.exteriorNumber) parts.push(`No. ${addr.exteriorNumber}`);
    if (addr.interiorNumber) parts.push(`Int. ${addr.interiorNumber}`);

    return parts.join(', ');
  });

  formattedLocationLines: Signal<string[]> = computed(() => {
    const addr: Address | null = this.address();
    if (!addr) return [];

    const lines: any[] = [];

    if (addr.neighborhood) {
      lines.push(addr.neighborhood);
    }

    if (addr.city) {
      lines.push(addr.city);
    }

    const stateZip: any[] = [];
    if (addr.state) stateZip.push(addr.state);
    if (addr.zipcode) stateZip.push(addr.zipcode);

    let locationLine: string = stateZip.join(' ');
    if (addr.country) {
      locationLine += locationLine ? `, ${addr.country}` : addr.country;
    }

    if (locationLine) {
      lines.push(locationLine);
    }

    return lines;
  });

  openInMaps() {
    const addr = this.address();
    if (!addr?.latitude || !addr?.longitude) return;

    const url = `https://www.google.com/maps/search/?api=1&query=${addr.latitude},${addr.longitude}`;
    window.open(url, '_blank');
  }
}
