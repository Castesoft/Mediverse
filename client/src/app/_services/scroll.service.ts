import { Injectable, NgZone, signal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  readonly scrollThreshold: number = 80;
  isScrolled = signal<boolean>(false);

  constructor(private ngZone: NgZone) {
    // Set the initial state
    this.isScrolled.set(window.pageYOffset > this.scrollThreshold);

    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll').pipe(
        throttleTime(16)
      ).subscribe(() => {
        const scrolled = window.pageYOffset > this.scrollThreshold;
        // Update the signal inside Angular's zone to trigger change detection
        this.ngZone.run(() => {
          this.isScrolled.set(scrolled);
        });
      });
    });
  }
}
