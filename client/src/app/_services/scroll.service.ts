import { Injectable, NgZone } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  readonly scrollThreshold: number = 80;
  isScrolled$!: Observable<boolean>;

  constructor(private ngZone: NgZone) {
    this.ngZone.runOutsideAngular(() => {
      this.isScrolled$ = fromEvent(window, 'scroll').pipe(
        throttleTime(16),
        map(() => window.pageYOffset > this.scrollThreshold),
        startWith(window.pageYOffset > this.scrollThreshold),
        distinctUntilChanged()
      );
    });
  }
}
