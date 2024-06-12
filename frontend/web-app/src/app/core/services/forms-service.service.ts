import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormsService {
  private modeSource = new BehaviorSubject<boolean>(true);
  mode$ = this.modeSource.asObservable();
  isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.init();
  }

  init = () => {
    if (this.isBrowser) {
      const validationMode = localStorage.getItem('validationMode');
      if (validationMode !== null) this.modeSource.next(validationMode === 'true');
    }
  }

  set = (value: boolean) => {
    this.isBrowser && localStorage.setItem('validationMode', value.toString());
    this.modeSource.next(value);
  }

  get = () => this.modeSource.value;
  toggle = () => {
    this.isBrowser && localStorage.setItem('validationMode', (!this.modeSource.value).toString());
    this.modeSource.next(!this.modeSource.value);
  }
}
