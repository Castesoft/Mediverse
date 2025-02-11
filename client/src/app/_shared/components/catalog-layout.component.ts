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
import { TemplateControlSearchComponent } from "src/app/_forms2/controls/template/template-control-search.component";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/_shared/material.module";
import { CollapseDirective } from "ngx-bootstrap/collapse";
import { FilterConfiguration, FilterOrientation } from "../../_models/base/filter-types";
import { FormUse } from "src/app/_models/forms/formTypes";

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
    TemplateControlSearchComponent,
    FormsModule,
    MaterialModule,
    CollapseDirective,
    NgClass,
  ],
})
export class GenericCatalogComponent<T extends Entity, P extends EntityParams<P>, F extends FormGroup2<P>, Z extends ServiceHelper<T, P, F>> implements OnDestroy {
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

  // Don't modify these:
  @ContentChild('entityTable') entityTable!: TemplateRef<any>;
  @ContentChild('entityFilterForm') entityFilterForm!: TemplateRef<any>;
  @ContentChild('entityCustomActions') entityCustomActions?: TemplateRef<any>;

  pagination: WritableSignal<Pagination | null> = signal<Pagination | null>(null);
  list: WritableSignal<T[]> = signal<T[]>([]);

  isDrawerOpen: boolean = false;
  isCollapsed: boolean = true;

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

  onSubmit(): void {
    this.toggleFilterCollapsed();
    this.params.update((pastValue): any => {
      return { ...pastValue, ...this.form().value }
    })
  }

  resetParams(): void {
    console.warn('Resetting parameters');
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

  protected readonly FormUse = FormUse;
}
