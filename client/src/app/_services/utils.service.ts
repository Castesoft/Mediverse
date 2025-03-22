import { Injectable, signal, WritableSignal } from '@angular/core';
import { mexicoCities } from 'src/app/_utils/util';
import { SelectOption } from "src/app/_models/base/selectOption";

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  title: string = 'DocHub';
  mexicoCities: any = mexicoCities;

  sidebarCollapsed: WritableSignal<boolean> = signal(false);

  toggleSidebar() {
    this.sidebarCollapsed.update((collapsed: boolean) => !collapsed);
  }

  get states(): string[] {
    return Object.keys(this.mexicoCities);
  }

  cities(selectedState: string): string[] | [] {
    return this.mexicoCities[selectedState];
  }

  get stateSelectOptions(): SelectOption[] {
    return this.states.map((state: string, i: number) => new SelectOption({
      id: i,
      code: state,
      name: state
    }));
  }

  citySelectOptions(selectedState: string): SelectOption[] {
    return this.cities(selectedState).map((city: string, i: number) => new SelectOption({
      id: i,
      code: city,
      name: city
    }));
  }

  getBootstrapClass(name: string | null): string {
    if (!name) return '';

    const bootstrapClasses: string[] = [
      'success',
      'danger',
      'info',
      'primary',
      'warning',
      'dark'
    ];

    const asciiSum: number = [ ...name ].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const classIndex: number = asciiSum % bootstrapClasses.length;

    return bootstrapClasses[classIndex];
  }

}
