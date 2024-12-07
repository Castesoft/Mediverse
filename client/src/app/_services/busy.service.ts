import { inject, Injectable } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { LoadingBarState } from '@ngx-loading-bar/core/loading-bar.state';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  loader: LoadingBarState;

  private loadingBar = inject(LoadingBarService);

  constructor() {
    this.loader = this.loadingBar.useRef();
  }

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
