import { CommonModule } from '@angular/common';
import {
  Component,
  HostBinding,
  inject,
  effect,
  model,
  signal, ModelSignal, WritableSignal
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Entity } from 'src/app/_models/base/entity';
import { EntityParams } from 'src/app/_models/base/entityParams';
import { IconsService } from 'src/app/_services/icons.service';
import { MaterialModule } from 'src/app/_shared/material.module';
import { Pagination } from 'src/app/_utils/serviceHelper/pagination/pagination';

@Component({
  host: { class: 'row' },
  selector: 'div[tablePager]',
  templateUrl: './table-pager.component.html',
  standalone: true,
  imports: [ CommonModule, MaterialModule, FontAwesomeModule ]
})
export class TablePagerComponent {
  readonly icons: IconsService = inject(IconsService);

  @HostBinding('class')
  get hostClasses(): string {
    return this.isCompact()
      ? 'row align-items-center justify-content-between py-0 pe-0 fs-9'
      : 'row align-items-center justify-content-end pt-4 pe-0 fs-8';
  }

  params: ModelSignal<EntityParams<Entity>> = model.required();
  pagination: ModelSignal<Pagination> = model.required();
  isCompact: ModelSignal<boolean> = model.required();

  hideShowing: ModelSignal<boolean> = model(false);
  hideShowAll: ModelSignal<boolean> = model(false);
  isLastPage: WritableSignal<boolean> = signal(false);

  constructor() {
    effect(() => {
      this.setIsLastPage();
    });
  }

  get totalPages(): number {
    return Math.ceil(
      (this.pagination().totalCount || 0) /
      (this.pagination().itemsPerPage || 1)
    );
  }

  private setIsLastPage(): void {
    this.isLastPage.set(this.pagination().currentPage === this.totalPages);
  }

  get pages(): number[] {
    const pages: number[] = [];
    const totalPages: number = this.totalPages;
    const currentPage: number = this.pagination().currentPage;
    const maxPagesToShow: number = 5;
    const halfPagesToShow: number = Math.floor(maxPagesToShow / 2);

    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= halfPagesToShow) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + halfPagesToShow >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfPagesToShow;
        endPage = currentPage + halfPagesToShow;
      }
    }

    for (let i: number = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  navigateToPage(page: number): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      newValues.pageNumber = page;
      return newValues;
    });
  }

  onNext(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      if (newValues.pageNumber !== null) {
        newValues.pageNumber++;
      }
      return newValues;
    });
  }

  onPrevious(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      if (newValues.pageNumber !== null) {
        newValues.pageNumber--;
      }
      return newValues;
    });
  }

  onLoadMore(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      newValues.pageSize = 50;
      newValues.pageNumber = 1;
      return newValues;
    });
  }

  onLoadLess(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      newValues.pageSize = 10;
      newValues.pageNumber = 1;
      return newValues;
    });
  }
}
