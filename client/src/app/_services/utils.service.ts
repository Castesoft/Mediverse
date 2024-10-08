import { Injectable, signal } from '@angular/core';
import { mexicoCities } from 'src/app/_utils/util';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  title = 'Mediverse';
  mexicoCities = mexicoCities;

  sidebarCollapsed = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  get states(): string[] {
    return Object.keys(this.mexicoCities);
  }

  cities(selectedState: string): string[] | [] {
    return this.mexicoCities[selectedState];
  }

  getBootstrapClass(name: string) {
    const bootstrapClasses = [
      'success',
      'danger',
      'info',
      'primary',
      'warning',
      'dark'
      // 'secondary', No son visibles
      // 'light',
    ];

    const asciiSum = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const classIndex = asciiSum % bootstrapClasses.length;

    return bootstrapClasses[classIndex];
  }

  constructor() { }
}
