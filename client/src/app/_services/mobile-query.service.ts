import { Injectable, signal } from "@angular/core";
import { debounceTime, fromEvent } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MobileQueryService {
  isMobile = signal<boolean>(false);

  private checkViewportWidth(): void {
    (window.innerWidth) > 768 ? this.isMobile.set(false) : this.isMobile.set(true);
  }

  constructor() {
    this.checkViewportWidth();
    this.initResizeListener();
  }

  private initResizeListener = (): void => {
    fromEvent(window, 'resize')
      .pipe(debounceTime(100))
      .subscribe(() => {
        this.checkViewportWidth();
      });
  }


}
