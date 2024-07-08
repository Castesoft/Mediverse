import { Injectable } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;
  loader = this.loadingBar.useRef();

  constructor(private loadingBar: LoadingBarService) { }

  busy() {
    this.busyRequestCount++;
    this.loadingBar.start();
  }

  idle() {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.loadingBar.complete();
    }
  }
}
