import { ElementRef, inject, Injectable, NgZone, signal, WritableSignal } from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { SidebarService } from "src/app/_services/sidebar.service";

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  private readonly sidebarService: SidebarService = inject(SidebarService);
  readonly scrollThreshold: number = 80;

  isScrolled: WritableSignal<boolean> = signal(false);

  constructor(private ngZone: NgZone) {
    this.isScrolled.set(window.pageYOffset > this.scrollThreshold);

    this.ngZone.runOutsideAngular(() => {
      fromEvent(window, 'scroll').pipe(throttleTime(16)).subscribe(() => {
        const scrolled: boolean = window.pageYOffset > this.scrollThreshold;
        this.ngZone.run(() => {
          this.isScrolled.set(scrolled);
        });
      });
    });
  }

  getUpdatedHeaderStyles(drawerElement: ElementRef): { [key: string]: string } {
    const baseStyles: { left: string; width: string; position?: string } = {
      left: '0px',
      width: '100%'
    };

    if (this.isScrolled()) {
      baseStyles.position = 'fixed';

      if (this.sidebarService.opened()) {
        const drawerWidth: any = drawerElement.nativeElement.getBoundingClientRect().width;
        baseStyles.left = `${drawerWidth}px`;
        baseStyles.width = `calc(100% - ${drawerWidth}px)`;
      }
    }

    return baseStyles;
  }
}
