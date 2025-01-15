import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private breadcrumbItemsSubject = new BehaviorSubject<BreadcrumbItem[]>([]);
  public breadcrumbItems$ = this.breadcrumbItemsSubject.asObservable();

  setBreadcrumbItems(items: BreadcrumbItem[]): void {
    this.breadcrumbItemsSubject.next(items);
  }

  clearBreadcrumbs(): void {
    this.breadcrumbItemsSubject.next([]);
  }
}
