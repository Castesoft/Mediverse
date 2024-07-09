import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  router = inject(Router);

  private breadcrumb = new BehaviorSubject<string | undefined>(undefined);
  breadcrumb$ = this.breadcrumb.asObservable();

  init() {
    this.router.events.subscribe({
      next: (event: any) => {
        if(event?.snapshot?.data['breadcrumb']) {
          const breadcrumb = event?.snapshot?.data['breadcrumb'];
          if (breadcrumb !== this.breadcrumb.value) {
            this.breadcrumb.next(breadcrumb);
          }
        }
      }
    })
  }
}
