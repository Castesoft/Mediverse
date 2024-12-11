import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, inject, HostBinding, model, output, signal, SimpleChanges } from '@angular/core';
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
  imports: [CommonModule, MaterialModule, FontAwesomeModule,]
})
export class TablePagerComponent implements OnInit, OnChanges {
  // injections
  icons = inject(IconsService);

  @HostBinding('class') get hostClasses() {
    return this.isCompact() ? 'row align-items-center justify-content-between py-2 pe-0 fs-9' : 'row align-items-center justify-content-end pt-4 pe-0 fs-8';
  }

  params = model.required<EntityParams<Entity>>();
  pagination = model.required<Pagination>();
  isCompact = model.required<boolean>();

  hideShowing = model<boolean>(false);
  hideShowAll = model<boolean>(false);

  isLastPage = signal<boolean>(false);

  ngOnInit(): void {
    this.setIsLastPage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log('changes', changes);
    if (changes['totalItems'] || changes['itemsPerPage'] || changes['currentPage']) {
      this.setIsLastPage();
    }
  }

  get totalPages(): number {
    return Math.ceil((this.pagination().totalItems || 0) / (this.pagination().itemsPerPage || 1));
  }

  setIsLastPage(): void {
    this.isLastPage.set(this.pagination().currentPage === this.totalPages);
  }

  get pages(): number[] {
    let pages = [];
    const totalPages = this.totalPages;
    const currentPage = this.pagination().currentPage;
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

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

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  navigateToPage(page: number): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues: EntityParams<Entity> = new EntityParams<Entity>(oldValues.key, { ...oldValues, });
      newValues.pageNumber = page;

      return newValues;
    });
  }

  onNext(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues: EntityParams<Entity> = new EntityParams<Entity>(oldValues.key, { ...oldValues, });
      newValues.pageNumber++;

      return newValues;
    });
  }

  onPrevious(): void {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues: EntityParams<Entity> = new EntityParams<Entity>(oldValues.key, { ...oldValues, });
      newValues.pageNumber--;

      return newValues;
    });
  }

  onLoadMore() {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues: EntityParams<Entity> = new EntityParams<Entity>(oldValues.key, { ...oldValues, });
      newValues.pageSize = 50;
      newValues.pageNumber = 1;

      return newValues;
    });
  }

  onLoadLess() {
    this.params.update((oldValues: EntityParams<Entity>) => {
      const newValues: EntityParams<Entity> = new EntityParams<Entity>(oldValues.key, { ...oldValues, });
      newValues.pageSize = 10;
      newValues.pageNumber = 1;

      return newValues;
    });
  }
}
