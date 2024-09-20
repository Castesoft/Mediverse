import { Component, OnDestroy, OnInit, effect, inject, input, model } from "@angular/core";
import { IconsService } from "src/app/_services/icons.service";
import { Pagination } from "src/app/_models/pagination";
import { ColorBlindnessesFilterFormComponent } from "./colorBlindnesses-filter-form.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { CommonModule } from "@angular/common";
import { ColorBlindnessesTableComponent } from "./colorBlindnesses-table.component";
import { Router, RouterModule } from "@angular/router";
import { CatalogMode, View } from "src/app/_models/types";
import { ControlsModule } from "src/app/_forms/controls.module";
import { TableModule } from "src/app/_shared/table/table.module";
import { Subject } from "rxjs";
import { createId } from "@paralleldrive/cuid2";
import { CdkModule } from "src/app/_shared/cdk.module";
import { MaterialModule } from "src/app/_shared/material.module";
import { ColorBlindness, ColorBlindnessParams, ColorBlindnessesService } from "src/app/colorBlindnesses/colorBlindnesses.config";

@Component({
  host: { class: 'mb-9', },
  selector: '[colorBlindnessesCatalog]',
  template: `
  <div class="pb-2">
  <h1 class="mb-4">{{ service.dictionary.ColorBlindnesses.title}}</h1>
  <div>
    <div class="row align-items-center justify-content-between g-3 mb-2">
      <div class="col-12 col-md-auto">
        <a type="button" class="btn btn-primary me-4" (click)="service.clickLink(undefined, key(), 'create', 'page')">
          <fa-icon [icon]="icons.faPlus" class="me-1" />
          Crear {{ service.dictionary.ColorBlindnesses.singular }}
        </a>
        @if (service.hasSelected(key(), mode()) | async) {
        @if (service.selectedCount(key(), mode()) | async; as count) {
        <button mat-raised-button [matBadge]="count" matBadgePosition="after" (click)="service.deleteRange$(key())">
          Eliminar {{ count > 1 ? service.dictionary.ColorBlindnesses.plural : service.dictionary.ColorBlindnesses.singular }}
        </button>
        }
        }
      </div>
      <div class="col-12 col-md-auto d-flex">
        <div colorBlindnessesFilterForm [formId]="formId" [(toggle)]="toggle" [item]="undefined" [key]="key()" [use]="'filter'"
          [view]="'inline'" [role]="'compact'" [mode]="mode()"></div>
      </div>
    </div>
    <div colorBlindnessesFilterForm [formId]="formId" [mode]="mode()" [(toggle)]="toggle" [item]="undefined" [key]="key()" [use]="'filter'" [view]="'inline'" [role]="'collapse'"></div>
  </div>
</div>
<div tableWrapper>
  <div tableResponsive>
    @if(service.list$(key(), mode()) | async; as _list) {
    <table colorBlindnessesTable [mode]="mode()" [data]="_list" [key]="key()" [view]="view()">
    </table>
    }
  </div>
  @if(service.pagination$(key()) | async; as _pagination) {
  <div tablePager [currentPage]="_pagination.currentPage"
    [itemsPerPage]="_pagination.itemsPerPage" [totalItems]="_pagination.totalItems" (loadMore)="service.loadMore(key())"
    (loadLess)="service.loadLess(key())" (pageChanged)="service.onPageChanged(key(), $event)"></div>
  }
</div>

  `,
  standalone: true,
  imports: [ FontAwesomeModule, ColorBlindnessesFilterFormComponent,
    ColorBlindnessesTableComponent, CommonModule,
    RouterModule, ControlsModule, TableModule, ColorBlindnessesFilterFormComponent,
    CdkModule, MaterialModule,
   ],
})
export class ColorBlindnessesCatalogComponent implements OnInit, OnDestroy {
  service = inject(ColorBlindnessesService);
  icons = inject(IconsService);
  private router = inject(Router);

  mode = input.required<CatalogMode>();
  key = input.required<string>();
  view = input.required<View>();
  item = input<ColorBlindness>();

  toggle = model(false);

  params!: ColorBlindnessParams;
  formId = `${this.router.url}#form-${createId()}`;
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  pagination?: Pagination;
  list?: ColorBlindness[];

  constructor() {

    effect(() => {
      this.params = new ColorBlindnessParams(this.key());
      this.service.createEntry(this.key(), this.params, this.mode());

      this.service.cache$.subscribe({ next: cache => {
        this.service.loadPagedList(this.key(), this.params).subscribe();
      }});
    })
  }

  ngOnInit(): void {
    this.service.param$(this.key(), this.mode()).subscribe({ next: params => this.params = params });
    this.service.list$(this.key(), this.mode()).subscribe({ next: list => this.list = list });
    this.service.pagination$(this.key()).subscribe({ next: pagination => this.pagination = pagination });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
