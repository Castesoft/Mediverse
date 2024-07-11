import { Injectable, inject } from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import { BehaviorSubject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  router = inject(Router);
  route = inject(ActivatedRoute);

  private breadcrumb = new BehaviorSubject<string | undefined>(undefined);
  breadcrumb$ = this.breadcrumb.asObservable();
  private title = new BehaviorSubject<string | undefined>(undefined);
  title$ = this.title.asObservable();

  init() {
    this.router.events.subscribe({
      next: (event: any) => {
        if(event?.snapshot?.data['breadcrumb']) {
          const breadcrumb = event?.snapshot?.data['breadcrumb'];
          if (breadcrumb !== this.breadcrumb.value) {
            this.breadcrumb.next(breadcrumb);
          }
        }
        if (event?.snapshot?.title) {
          const title = event?.snapshot?.title;
          if (title !== this.title.value) {
            this.title.next(title);
          }
        }
      }
    })
  }
}
