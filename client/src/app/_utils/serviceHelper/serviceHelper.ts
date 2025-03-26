import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import {
  Component,
  effect,
  inject,
  ModelSignal,
  signal,
  Type,
  WritableSignal,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { SelectOption } from 'src/app/_models/base/selectOption';
import { Modal } from 'src/app/_models/modal';
import { Pagination } from 'src/app/_utils/serviceHelper/pagination/pagination';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { Column, columnId } from 'src/app/_models/base/column';
import { NamingSubject } from 'src/app/_models/base/namingSubject';
import { EntityParams } from 'src/app/_models/base/entityParams';
import { Entity } from 'src/app/_models/base/entity';
import { environment } from 'src/environments/environment';
import { FormGroup2 } from 'src/app/_models/forms/formGroup2';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import {
  transform,
  transformToHttpParams,
} from 'src/app/_models/base/paramUtils';
import { ParamRecord } from 'src/app/_utils/serviceHelper/paramRecord';
import {
  getPaginatedResponse,
  PaginatedResponse,
} from 'src/app/_utils/serviceHelper/pagination/paginatedResponse';
import { getFormHeaderText } from 'src/app/_models/forms/formUtils';
import { FormUse } from 'src/app/_models/forms/formTypes';
import { ConfirmService } from 'src/app/_services/confirm/confirm.service';
import { DevService } from '../../_services/dev.service';
import { SelectionService } from 'src/app/_models/services/selection.service';
import DetailDialog from 'src/app/_models/base/components/types/detailDialog';
import { SiteSection } from 'src/app/_models/sections/sectionTypes';
import { ClickLinkHandler } from 'src/app/_utils/serviceHelper/clickLinkHandler';
import { SubmitOptions } from 'src/app/_utils/serviceHelper/types/submitOptions';
import { ToastrService } from 'ngx-toastr';

/**
 * A helper class that provides common service functionalities for handling entities, parameters, forms, etc.
 *
 * @template T - The entity type that extends `Entity`.
 * @template U - The parameter type that extends `EntityParams<U>` and implements `IParams`.
 * @template V - The form group type that extends `FormGroup2<U>`.
 * @template W - The detail dialog type that extends `DetailDialog<T>`.
 */
export class ServiceHelper<
  T extends Entity,
  U extends EntityParams<U>,
  V extends FormGroup2<U>,
  W extends Component = any
> {
  protected readonly http = inject(HttpClient);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly confirm = inject(ConfirmService);
  protected readonly matSnackBar = inject(MatSnackBar);
  protected readonly toastr = inject(ToastrService);

  readonly dev = inject(DevService);

  private readonly selectionService: SelectionService<T> = inject(
    SelectionService<T>
  );

  matDialog = inject(MatDialog);
  readonly modalComponent?: Type<W>;

  clickLinkHandler?: ClickLinkHandler<T>;

  selected$ = (key: string) => this.selectionService.getSelection$(key);
  getSelected$ = (key: string) =>
    this.selectionService.getCurrentSelection(key)
      ? [this.selectionService.getCurrentSelection(key)!]
      : [];
  hasSelected$ = (key: string) => this.selectionService.hasSelection(key);
  setSelected$ = (key: string, value: T | null) =>
    this.selectionService.setSelection(key, value);

  multipleSelected$ = (key: string) =>
    this.selectionService.getMultipleSelections$(key);
  setMultipleSelected = (key: string, values: T[]) =>
    this.selectionService.setMultipleSelections(key, values);
  toggleMultipleSelected$ = (key: string, value: T) =>
    this.selectionService.toggleSelection(key, value);
  toggleMultipleSelectedArray$ = (key: string, values: T[]) =>
    this.selectionService.toggleMultipleSelectArray(key, values);

  baseUrl: string;
  dictionary: NamingSubject;
  columns: Column[] = [];

  private readonly _data = new BehaviorSubject<T[]>([]);
  data$ = this._data.asObservable().pipe(shareReplay(1));

  get data(): BehaviorSubject<T[]> {
    return this._data;
  }

  paginatedData: PaginatedResponse<T> | null = null;
  options = signal<SelectOption[]>([]);

  loading = signal<boolean>(false);
  private loadingOperations = signal<number>(0);

  params = new BehaviorSubject<ParamRecord<T, U>>(
    new ParamRecord<T, U>(this.paramsConstructor)
  );
  params$ = this.params.asObservable().pipe(shareReplay(1));

  private entityCache = new Map<number, T>();
  private lastAllFetch: Date | null = null;
  private cacheExpiration = 5 * 60 * 1000;

  constructor(
    private paramsConstructor: new (key: string) => U,
    controller: string,
    dictionary: NamingSubject,
    columns: Column[],
    modalComponent?: Type<W>
  ) {
    this.baseUrl = `${environment.apiUrl}${controller.toLowerCase()}/`;
    this.dictionary = dictionary;
    this.modalComponent = modalComponent;
    effect(() => this.updateColumns(columns));

    this.data$.subscribe((entities) => {
      entities.forEach((entity) => {
        if (entity.id) {
          this.entityCache.set(entity.id, entity);
        }
      });
    });
  }

  /**
   * Add ID column if development mode is enabled.
   * @param columns
   * @private
   */
  private updateColumns(columns: Column[]): void {
    this.columns = this.dev.isDev() ? [columnId, ...columns] : columns;
  }

  /**
   * Sets loading state safely by tracking concurrent operations
   * @param isLoading Whether an operation is starting (true) or finishing (false)
   */
  private setLoadingState(isLoading: boolean): void {
    this.loadingOperations.update((count) => {
      const newCount = isLoading ? count + 1 : Math.max(0, count - 1);
      this.loading.set(newCount > 0);
      return newCount;
    });
  }

  /**
   * Handles HTTP errors consistently
   * @param error The error that occurred
   * @param context Additional context about the operation
   * @returns An observable that completes with an error
   */
  private handleError(error: any, context: string): Observable<never> {
    let errorMessage = `Error in ${context}: `;

    if (error instanceof HttpErrorResponse) {
      errorMessage +=
        error.status === 0
          ? 'Server unreachable. Check your network connection.'
          : `${error.status} - ${error.error?.message || error.statusText}`;
    } else {
      errorMessage += error.message || 'Unknown error occurred';
    }

    console.error(errorMessage, error);

    return throwError(() => error);
  }

  /**
   * Loads a paginated list of entities from the backend.
   * Sets the loading signal to true while the request is in progress.
   */
  loadPagedList = (
    key: string | null,
    param: U
  ): Observable<PaginatedResponse<T>> => {
    if (key === null) throw new Error('Key cannot be null');

    const payload: HttpParams = transformToHttpParams(transform(param));

    this.setLoadingState(true);
    return getPaginatedResponse<T>(this.baseUrl, payload, this.http).pipe(
      tap((response) => {
        this.paginatedData = response;
        this.data.next(response.result);

        response.result.forEach((entity) => {
          if (entity.id) {
            this.entityCache.set(entity.id, entity);
          }
        });
      }),
      catchError((error) => this.handleError(error, 'loadPagedList')),
      finalize(() => this.setLoadingState(false))
    );
  };

  /**
   * Returns the current data as an observable (ignoring the key).
   */
  list$(key: string | null): Observable<T[]> {
    if (key === null) throw new Error('Key cannot be null');
    return this.data$;
  }

  /**
   * Toggles an item's "collapsed" state in this.data.
   */
  toggleCollapsedInService(id: number) {
    const updated = this.data.value.map((p) => {
      if (p.id === id) {
        const updatedItem = { ...p, isCollapsed: !p.isCollapsed };
        if (updatedItem.id) {
          this.entityCache.set(updatedItem.id, updatedItem);
        }
        return updatedItem;
      }
      return { ...p, isCollapsed: false };
    });
    this.data.next(updated);
  }

  /**
   * Handles navigation or modal display based on view mode
   */
  clickLink(
    item: T | null,
    key: string | null,
    use: FormUse = FormUse.DETAIL,
    view: View,
    siteSection?: SiteSection
  ): void {
    if (this.clickLinkHandler) {
      this.clickLinkHandler(item, key, use, view, siteSection);
      return;
    }

    if (view === 'modal' && this.modalComponent) {
      this.matDialog.open<W, DetailDialog<T>>(
        this.modalComponent,
        this.buildModalConfig(item, key, use, view)
      );
    } else if (view === 'modal' && !this.modalComponent) {
      console.error(
        'Modal component not defined during constructor initialization'
      );
      this.toastr.error(
        'Cannot open modal view - component not configured',
        'Configuration Error'
      );
    } else {
      const route = this.dictionary.buildFromSiteSection(
        use,
        item?.id,
        siteSection
      );
      this.router.navigate([route]).then(
        () => {},
        (error) => console.error('Navigation error:', error)
      );
    }
  }

  private buildModalConfig(
    item: T | null,
    key: string | null,
    use: FormUse = FormUse.DETAIL,
    view: View
  ): MatDialogConfig<DetailDialog<T>> {
    const title: string = this.getFormHeaderText(use, item);
    return {
      data: {
        item: item,
        key: key,
        use: use,
        view: view,
        title: title,
      },
      disableClose: true,
      hasBackdrop: true,
      panelClass: ['window'],
    };
  }

  /**
   * Returns pagination info if `paginatedData` is set.
   */
  pagination$(key: string | null): Observable<Pagination | null> {
    if (key === null) throw new Error('Key cannot be null');
    return this.paginatedData ? of(this.paginatedData.pagination) : of(null);
  }

  /**
   * Resets the parameter set for the provided key.
   */
  resetParam = (key: string): void => {
    this.params.next(this.params.value.reset(key));
  };

  /**
   * Fetches all entities.
   * Sets the loading signal to true while the request is in progress.
   * Uses caching to avoid unnecessary network requests.
   */
  getAll(): Observable<T[]> {
    const now = new Date();
    if (
      this.lastAllFetch &&
      now.getTime() - this.lastAllFetch.getTime() < this.cacheExpiration &&
      this.data.value.length > 0
    ) {
      return of(this.data.value);
    }

    this.setLoadingState(true);
    return this.http.get<T[]>(`${this.baseUrl}all/`).pipe(
      map((response) => {
        this.data.next(response);
        this.lastAllFetch = new Date();

        response.forEach((entity) => {
          if (entity.id) {
            this.entityCache.set(entity.id, entity);
          }
        });

        return response;
      }),
      catchError((error) => this.handleError(error, 'getAll')),
      finalize(() => this.setLoadingState(false)),
      shareReplay(1)
    );
  }

  /**
   * Fetches an array of `SelectOption` objects.
   * Uses caching to avoid unnecessary network requests.
   */
  getOptions(): Observable<SelectOption[]> {
    if (this.options().length > 0) {
      return of(this.options());
    }

    this.setLoadingState(true);
    return this.http.get<SelectOption[]>(`${this.baseUrl}options`).pipe(
      map((response) => {
        this.options.set(response);
        return response;
      }),
      catchError((error) => this.handleError(error, 'getOptions')),
      finalize(() => this.setLoadingState(false)),
      shareReplay(1)
    );
  }

  /**
   * Gets a single entity by ID, checking local cache first, then local data, then the backend.
   */
  getById(id: number): Observable<T> {
    if (this.entityCache.has(id)) {
      return of(this.entityCache.get(id)!);
    }

    const item = this.data.value.find((a) => a.id === id);
    if (item) {
      this.entityCache.set(id, item);
      return of(item);
    }

    this.setLoadingState(true);
    return this.http.get<T>(`${this.baseUrl}${id}`).pipe(
      tap((response) => {
        if (response.id) {
          this.entityCache.set(response.id, response);
        }
        this.data.next([...this.data.value, response]);
      }),
      catchError((error) => this.handleError(error, `getById(${id})`)),
      finalize(() => this.setLoadingState(false)),
      shareReplay(1)
    );
  }

  /**
   * Retrieves an entity from local data only (returns null if not found).
   */
  getByIdFromData(id: number): T | null {
    if (this.entityCache.has(id)) {
      return this.entityCache.get(id)!;
    }

    return this.data.value.find((a) => a.id === id) ?? null;
  }

  /**
   * Creates a new entity on the server and updates local data/redirects if needed.
   */
  create(form: FormGroup2<T>, options?: Partial<SubmitOptions>): Observable<T> {
    if (!form.valid) {
      this.toastr.warning(
        'Please correct the form errors before submitting.',
        'Form Validation'
      );
      return EMPTY;
    }

    this.setLoadingState(true);
    return this.http
      .post<T>(
        options?.id ? `${this.baseUrl}${options.id}` : this.baseUrl,
        options?.value ?? form.value
      )
      .pipe(
        tap((response) => {
          this.toastr.success(
            `${this.dictionary.singularTitlecase} created successfully`,
            'Success'
          );

          this.handleOptionsAfterRequest(options, response);

          if (response.id) {
            this.entityCache.set(response.id, response);
          }
          this.data.next([...this.data.value, response]);
        }),
        catchError((error) => this.handleError(error, 'create')),
        finalize(() => this.setLoadingState(false))
      );
  }

  /**
   * Updates an existing entity on the server and updates local data/redirects if needed.
   */
  update(form: FormGroup2<T>, options?: Partial<SubmitOptions>): Observable<T> {
    if (!form.valid) {
      this.toastr.warning(
        'Please correct the form errors before submitting.',
        'Form Validation'
      );
      return EMPTY;
    }

    const id = options?.id ?? form.controls.id.value;

    this.setLoadingState(true);
    return this.http
      .put<T>(`${this.baseUrl}${id}`, options?.value ?? form.value)
      .pipe(
        tap((response) => {
          this.matSnackBar.open(
            `${this.dictionary.singularTitlecase} ${response.id} actualizado correctamente`,
            'Cerrar',
            { duration: 3000 }
          );

          this.handleOptionsAfterRequest(options, response);

          if (response.id) {
            this.entityCache.set(response.id, response);
          }

          this.updateDataAfterModification(id!, response);

          this.updateOptionsAfterModification(id!, response);
        }),
        catchError((error) => this.handleError(error, `update(${id})`)),
        finalize(() => this.setLoadingState(false))
      );
  }

  /**
   * Updates the data BehaviorSubject after a modification
   */
  private updateDataAfterModification(id: number, response: T): void {
    if (this.data.value.length === 0) {
      this.data.next([response]);
    } else {
      this.data.next(this.data.value.map((a) => (a.id === id ? response : a)));
    }
  }

  /**
   * Updates the options signal after a modification
   */
  private updateOptionsAfterModification(id: number, response: T): void {
    if (this.options().length === 0) {
      const optionToAdd = new SelectOption();

      if (response.name) optionToAdd.name = response.name;
      if (response.code) optionToAdd.code = response.code;
      if (response.id) optionToAdd.id = response.id;
      if (response.isVisible) optionToAdd.visible = response.isVisible;
      if (response.isEnabled) optionToAdd.enabled = response.isEnabled;

      this.options.update((oldValues) => [...oldValues, optionToAdd]);
    } else {
      this.options.update((options) => {
        const index = options.findIndex((o) => o.id === id);
        if (index !== -1) {
          const updatedOptions = [...options];
          const option = { ...updatedOptions[index] };

          if (response.name) option.name = response.name;
          if (response.code) option.code = response.code;
          if (response.isVisible !== undefined)
            option.visible = response.isVisible;
          if (response.isEnabled !== undefined)
            option.enabled = response.isEnabled;

          updatedOptions[index] = option;
          return updatedOptions;
        }
        return options;
      });
    }
  }

  /**
   * Handles post-request operations like redirecting and displaying messages
   */
  private handleOptionsAfterRequest(
    options: Partial<SubmitOptions> | undefined,
    response: T
  ): void {
    if (!options) return;

    const { redirectUrl, useIdAfterResponseForRedirect, toastMessage } =
      options;
    const id: string = response.id?.toString() || '';

    if (redirectUrl) {
      const url: string = useIdAfterResponseForRedirect
        ? `${redirectUrl}/${id}`
        : redirectUrl;
      this.router.navigate([url]).catch((error) => {
        console.error('Navigation error:', error);
        this.toastr.error(
          'Failed to navigate after operation',
          'Navigation Error'
        );
      });
    }

    if (toastMessage) {
      this.toastr.success(toastMessage);
    }
  }

  /**
   * (Placeholder) Resets the form. (No cache used.)
   */
  resetForm(key: string, form: V) {}

  /**
   * Deletes a single entity from the server and updates local data.
   */
  private delete(id: number): Observable<void> {
    this.setLoadingState(true);
    return this.http.delete<void>(`${this.baseUrl}${id}`).pipe(
      tap(() => {
        this.entityCache.delete(id);

        this.data.next(this.data.value.filter((s) => s.id !== id));

        this.options.update((options) => options.filter((o) => o.id !== id));
      }),
      catchError((error) => this.handleError(error, `delete(${id})`)),
      finalize(() => this.setLoadingState(false))
    );
  }

  /**
   * Confirms and deletes a single item.
   */
  delete$ = (item: T) => {
    if (!item || !item.id) {
      this.toastr.error('Cannot delete item without an ID', 'Delete Error');
      return;
    }

    this.confirm.confirm(this.getConfirmDeleteItem(item)).subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.delete(item.id!).subscribe({
            next: () => {
              this.matSnackBar.open(
                `${this.dictionary.articles.definedSingular} ${this.dictionary.singular} ${item.id} ha sido eliminado`,
                'Cerrar',
                { duration: 5000 }
              );
            },
          });
        }
      },
    });
  };

  /**
   * Deletes a range of entities by their IDs (server-side).
   */
  private deleteRange(ids: string): Observable<void> {
    this.setLoadingState(true);
    return this.http.delete<void>(`${this.baseUrl}range/${ids}`).pipe(
      tap(() => {
        const idArray = ids.split(',').map((id) => parseInt(id.trim(), 10));

        this.data.next(
          this.data.value.filter((item) => !idArray.includes(item.id!))
        );

        idArray.forEach((id) => this.entityCache.delete(id));

        this.options.update((options) =>
          options.filter((o) => !idArray.includes(o.id!))
        );
      }),
      catchError((error) => this.handleError(error, `deleteRange(${ids})`)),
      finalize(() => this.setLoadingState(false))
    );
  }

  submitForm(key: string | null, params: U): void {
    this.loadPagedList(key, params).subscribe({
      error: () => {},
    });
  }

  /**
   * (Placeholder) for deleting a range of items by key.
   */
  deleteRange$(key: string | null) {
    if (key === null) throw new Error('Key cannot be null');
  }

  /**
   * Confirms and deletes multiple items by their IDs.
   */
  deleteRangeByIds$(ids: number[]): Observable<boolean> {
    if (!ids.length) {
      this.toastr.warning(
        'No items selected for deletion',
        'Selection Required'
      );
      return of(false);
    }

    return this.confirm.confirm(this.getConfirmDeleteRange(ids.length)).pipe(
      switchMap((result) => {
        if (result) {
          return this.deleteRange(ids.join(',')).pipe(
            map(() => {
              this.matSnackBar.open(
                `Los (${ids.length}) ${this.dictionary.plural} seleccionados fueron eliminados.`,
                'Cerrar',
                { duration: 5000 }
              );
              return true;
            }),
            catchError(() => {
              return of(false);
            })
          );
        }
        return of(false);
      })
    );
  }

  /**
   * Returns selected IDs as a comma-separated string
   */
  selectedIdsAsString = (key: string): string => {
    const selections = this.selectionService.getMultipleSelections(key);
    return selections
      .map((item) => item.id)
      .filter((id) => id !== undefined)
      .join(',');
  };

  /**
   * Creates a modal for deleting multiple items
   */
  private getConfirmDeleteRange(count: number): Modal {
    return new Modal({
      btnCancelText: 'Cancelar',
      btnOkText: 'Eliminar',
      message: `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedPlural} (${count}) ${this.dictionary.plural} seleccionados?`,
      title: `Eliminar ${this.dictionary.plural}`,
    });
  }

  /**
   * Creates a modal for deleting a single item
   */
  private getConfirmDeleteItem(item: T): Modal {
    return new Modal({
      btnCancelText: 'Cancelar',
      btnOkText: 'Eliminar',
      message: `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`,
      title: `Eliminar ${this.dictionary.singular}`,
    });
  }

  /**
   * Creates a modal for updating an item
   */
  private getConfirmUpdateItem(item: T): Modal {
    return new Modal({
      btnCancelText: 'Cancelar',
      btnOkText: 'Actualizar',
      message: `¿Confirmas los cambios hechos en ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`,
      title: `Actualizar ${this.dictionary.singular}`,
    });
  }

  /**
   * Gets form header text based on use and item
   */
  protected getFormHeaderText(use: FormUse, item: T | null): string {
    return getFormHeaderText(
      this.dictionary,
      use,
      item === null ? null : item.id
    );
  }

  /**
   * Handles row click navigation based on view mode
   */
  clickRow(
    item: T,
    key: ModelSignal<string | null>,
    view: ModelSignal<View>,
    mode: ModelSignal<CatalogMode>,
    isMobile: WritableSignal<boolean>,
    relativeRoute: ActivatedRoute,
    options?: {
      routeUrl?: string;
    }
  ) {
    if (!item?.id) {
      this.toastr.warning(
        'Cannot navigate to item without an ID',
        'Navigation Error'
      );
      return;
    }

    try {
      const navigateTo = (path: any[]) => {
        this.router
          .navigate(path, { relativeTo: relativeRoute })
          .catch((error) => {
            console.error('Navigation error:', error);
            this.toastr.error('Failed to navigate', 'Navigation Error');
          });
      };

      if (isMobile()) {
        if (mode() === 'view' && (view() === 'page' || view() === 'inline')) {
          navigateTo([item.id]);
        }
      } else {
        if (mode() === 'view') {
          if (view() === 'modal' && this.modalComponent) {
            this.clickLink(item, key(), FormUse.DETAIL, 'modal');
          } else if (view() === 'page') {
            navigateTo([item.id]);
          }
        }
      }
    } catch (error) {
      console.error('Error in clickRow:', error);
      this.toastr.error(
        'An error occurred while handling the row click',
        'Navigation Error'
      );
    }
  }

  /**
   * Invalidates the cache for a specific entity or all entities
   * Useful when external operations modify entities
   */
  invalidateCache(entityId?: number): void {
    if (entityId !== undefined) {
      this.entityCache.delete(entityId);
    } else {
      this.entityCache.clear();
      this.lastAllFetch = null;
    }
  }
}
