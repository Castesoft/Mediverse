import { CommonModule } from '@angular/common';
import { Component, HostBinding, inject, input, Input, model, OnChanges, OnInit, output, signal, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconsService } from 'src/app/_services/icons.service';
import { MaterialModule } from 'src/app/_shared/material.module';

@Component({
  selector: '[tablePager]',
  templateUrl: './table-pager.component.html',
  standalone: true,
  imports: [ CommonModule, MaterialModule, FontAwesomeModule, ]
})
export class TablePagerComponent implements OnInit, OnChanges {
  // injections
  icons = inject(IconsService);

  @HostBinding('class') get hostClasses() {
    return this.isCompact() ? 'row align-items-center justify-content-between py-2 pe-0 fs-9' : 'row align-items-center justify-content-end pt-4 pe-0 fs-8';
  }

  totalItems = model.required<number>();
  itemsPerPage = model.required<number>();
  currentPage = model<number>(1);
  isCompact = model.required<boolean>();

  pageChanged = output<number>();
  loadMore = output<void>();
  loadLess = output<void>();

  isLastPage = signal<boolean>(false);

  hideShowing = model<boolean>(false);
  hideShowAll = model<boolean>(false);

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
    return Math.ceil((this.totalItems() || 0) / (this.itemsPerPage() || 1));
  }

  setIsLastPage(): void {
    this.isLastPage.set(this.currentPage() === this.totalPages);
  }

  get pages(): number[] {
    let pages = [];
    const totalPages = this.totalPages;
    const currentPage = this.currentPage();
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
    this.currentPage.set(page);
    this.pageChanged.emit(page);
  }

  onNext(): void {
    if (this.currentPage() < this.totalPages) {
      this.navigateToPage(this.currentPage() + 1);
    }
  }

  onPrevious(): void {
    if (this.currentPage() > 1) {
      this.navigateToPage(this.currentPage() - 1);
    }
  }

  onLoadMore() {
    this.loadMore.emit();
  }

  onLoadLess() {
    this.loadLess.emit();
  }
}
