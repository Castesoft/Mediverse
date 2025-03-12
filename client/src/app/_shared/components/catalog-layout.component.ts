import {
  Component,
  ContentChild,
  effect,
  inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnDestroy,
  OnInit,
  signal,
  TemplateRef,
  WritableSignal
} from '@angular/core';
import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Entity } from 'src/app/_models/base/entity';
import { EntityParams } from 'src/app/_models/base/entityParams';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { ValidationService } from 'src/app/_services/validation.service';
import { DevService } from 'src/app/_services/dev.service';
import { IconsService } from 'src/app/_services/icons.service';
import { ServiceHelper } from 'src/app/_utils/serviceHelper/serviceHelper';
import { Pagination } from 'src/app/_utils/serviceHelper/pagination/pagination';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { TableWrapperComponent } from "src/app/_shared/template/components/tables/table-wrapper.component";
import { TablePagerComponent } from "src/app/_shared/template/components/tables/table-pager.component";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/_shared/material.module";
import { CollapseDirective } from "ngx-bootstrap/collapse";
import { FilterConfiguration, FilterOrientation } from "../../_models/base/filter-types";
import { FormUse } from "src/app/_models/forms/formTypes";
import { DuotoneMagnifierComponent } from "src/app/_shared/template/components/icons/duotone-magnifier.component";
import {
  CatalogLayoutSkeletonComponent
} from "src/app/_shared/components/catalog-layout-skeleton/catalog-layout-skeleton.component";

@Component({
  selector: 'div[catalogLayout]',
  templateUrl: './catalog-layout.component.html',
  styleUrls: [ './catalog-layout.component.scss' ],
  standalone: true,
  imports: [
    NgTemplateOutlet,
    AsyncPipe,
    TableWrapperComponent,
    TablePagerComponent,
    FormsModule,
    MaterialModule,
    CollapseDirective,
    NgClass,
    DuotoneMagnifierComponent,
    CatalogLayoutSkeletonComponent,
  ],
})
export class GenericCatalogComponent<T extends Entity, P extends EntityParams<P>, F extends FormGroup2<P>, Z extends ServiceHelper<T, P, F>> implements OnDestroy, OnInit {
  protected readonly FormUse: typeof FormUse = FormUse;

  service: InputSignal<Z> = input.required();
  form: ModelSignal<F> = model.required();
  fromWrapper: ModelSignal<boolean> = model(false);

  filterConfig: ModelSignal<FilterConfiguration> = model(new FilterConfiguration());

  key: ModelSignal<string | null> = model.required();
  params: ModelSignal<P> = model.required();
  item: ModelSignal<T | null> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  view: ModelSignal<View> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  embedded: ModelSignal<boolean> = model(false);
  useCard: ModelSignal<boolean> = model(true);
  title: ModelSignal<string | undefined> = model();
  hideAddButton: ModelSignal<boolean> = model(false);

  // Don't modify these:
  @ContentChild('entityTable') entityTable!: TemplateRef<any>;
  @ContentChild('entityFilterForm') entityFilterForm!: TemplateRef<any>;
  @ContentChild('entityCustomActions') entityCustomActions?: TemplateRef<any>;

  pagination: WritableSignal<Pagination | null> = signal<Pagination | null>(null);
  list: WritableSignal<T[]> = signal<T[]>([]);

  isDrawerOpen: boolean = false;
  isCollapsed: boolean = true;

  private defaultFilterParams: Partial<P> | null = null;

  protected route: ActivatedRoute = inject(ActivatedRoute);
  protected router: Router = inject(Router);
  protected toastr: ToastrService = inject(ToastrService);
  protected validation: ValidationService = inject(ValidationService);
  protected matSnackBar: MatSnackBar = inject(MatSnackBar);
  protected dev: DevService = inject(DevService);
  protected icons: IconsService = inject(IconsService);

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
    effect((): void => {
      this.service().loadPagedList(this.key(), this.params()).subscribe();
    });
  }

  ngOnInit(): void {
    this.defaultFilterParams = { ...this.params() };
  }

  onSubmit(): void {
    if (this.isDrawerOpen || !this.isCollapsed) {
      this.toggleFilterCollapsed();
    }

    this.params.update((pastValue): any => ({ ...pastValue, ...this.form().value }));
  }

  handleKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter') return;
    if (!(this.isDrawerOpen || !this.isCollapsed)) return;

    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }

    event.preventDefault();
    this.onSubmit();
  }

  handleSearchChange(event: Event): void {
    const search: string = (event.target as HTMLInputElement).value;
    this.form().controls.search.patchValue(search);
    this.onSubmit();
  }

  resetParams(): void {
    this.params.set(this.defaultFilterParams as P);
    this.form().resetForm();
  }

  toggleFilterOrientation(): void {
    this.filterConfig.update((pastValue): FilterConfiguration => {
      pastValue.orientation =
        pastValue.orientation === FilterOrientation.VERTICAL
          ? FilterOrientation.HORIZONTAL
          : FilterOrientation.VERTICAL;
      return pastValue;
    });
  }

  toggleFilterCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
    this.isDrawerOpen = !this.isDrawerOpen;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
