import { CommonModule } from '@angular/common';
import { Component, effect, HostBinding, inject, model, ModelSignal, signal, WritableSignal } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Entity } from 'src/app/_models/base/entity';
import { EntityParams } from 'src/app/_models/base/entityParams';
import { IconsService } from 'src/app/_services/icons.service';
import { MaterialModule } from 'src/app/_shared/material.module';
import { Pagination } from 'src/app/_utils/serviceHelper/pagination/pagination';

/**
 * Component for rendering pagination controls.
 *
 * Displays page numbers, navigation buttons (previous/next),
 * and optionally shows pagination information like current page range and total items.
 *
 * @selector div[tablePager]
 * @standalone
 * @imports CommonModule, MaterialModule, FontAwesomeModule, NumberPipe
 */
@Component({
  selector: 'div[tablePager]',
  templateUrl: './table-pager.component.html',
  imports: [ CommonModule, MaterialModule, FontAwesomeModule ]
})
export class TablePagerComponent {
  readonly icons: IconsService = inject(IconsService);

  @HostBinding('class')
  get hostClasses(): string {
    return this.isCompact()
      ? 'align-items-center justify-content-between py-0 pe-0 fs-9'
      : 'align-items-center justify-content-end pt-4 pe-0 fs-8';
  }

  params: ModelSignal<EntityParams<Entity>> = model.required<EntityParams<Entity>>();
  pagination: ModelSignal<Pagination> = model.required<Pagination>();

  isCompact: ModelSignal<boolean> = model.required<boolean>();
  hideShowing: ModelSignal<boolean> = model(true);
  hideShowAll: ModelSignal<boolean> = model(false);
  isLoading: ModelSignal<boolean> = model(false);

  isLastPage: WritableSignal<boolean> = signal(false);

  constructor() {
    effect(() => {
      this.setIsLastPage();
    });
  }

  /**
   * Calculates the total number of pages based on pagination data.
   * @returns number - Total pages. Defaults to 0 if pagination data is incomplete.
   */
  get totalPages(): number {
    return Math.ceil(
      (this.pagination().totalCount || 0) /
      (this.pagination().itemsPerPage || 1)
    );
  }

  /**
   * Updates the `isLastPage` signal based on the current page and total pages.
   * @private
   */
  private setIsLastPage(): void {
    this.isLastPage.set(this.pagination().currentPage === this.totalPages);
  }

  /**
   * Generates an array of page numbers to display in the pagination control.
   * Calculates the range of pages to show based on current page, total pages, and a maximum number of pages to display.
   * @returns number[] - Array of page numbers to display.
   */
  get pages(): number[] {
    const pages: number[] = [];
    const totalPages: number = this.totalPages;
    const currentPage: number = this.pagination().currentPage;
    const maxPagesToShow: number = 5; // Maximum number of page links to display
    const halfPagesToShow: number = Math.floor(maxPagesToShow / 2);

    let startPage: number, endPage: number;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= halfPagesToShow) {
        // Near the start
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + halfPagesToShow >= totalPages) {
        // Near the end
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        // In the middle
        startPage = currentPage - halfPagesToShow;
        endPage = currentPage + halfPagesToShow;
      }
    }

    for (let i: number = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Navigates to a specific page.
   * Updates the `pageNumber` in the `params` signal, triggering a data reload in the parent component.
   * @param page number - The page number to navigate to.
   */
  navigateToPage(page: number): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      newValues.pageNumber = page;
      return newValues;
    });
  }

  /**
   * Navigates to the next page.
   * Increments the `pageNumber` in the `params` signal if not already on the last page.
   */
  onNext(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      if (newValues.pageNumber !== null && newValues.pageNumber < this.totalPages) { // Ensure not exceeding total pages
        newValues.pageNumber++;
      }
      return newValues;
    });
  }

  /**
   * Navigates to the previous page.
   * Decrements the `pageNumber` in the `params` signal if not already on the first page.
   */
  onPrevious(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      if (newValues.pageNumber !== null && newValues.pageNumber > 1) { // Ensure not going below page 1
        newValues.pageNumber--;
      }
      return newValues;
    });
  }

  /**
   * Action to load more items, typically setting a larger page size and resetting to the first page.
   * Updates `pageSize` to 50 and `pageNumber` to 1 in the `params` signal.
   */
  onLoadMore(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      newValues.pageSize = 50;
      newValues.pageNumber = 1;
      return newValues;
    });
  }

  /**
   * Action to load fewer items, typically setting a smaller page size and resetting to the first page.
   * Updates `pageSize` to 10 and `pageNumber` to 1 in the `params` signal.
   */
  onLoadLess(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues = new EntityParams<Entity>(oldValues.key, { ...oldValues });
      newValues.pageSize = 10;
      newValues.pageNumber = 1;
      return newValues;
    });
  }
}
