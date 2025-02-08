import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, effect, inject, signal, Type } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { SelectOption } from "src/app/_models/base/selectOption";
import { Modal } from "src/app/_models/modal";
import { Pagination } from "src/app/_utils/serviceHelper/pagination/pagination";
import { View } from "src/app/_models/base/types";
import { Column, columnId } from "src/app/_models/base/column";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { EntityParams } from "src/app/_models/base/entityParams";
import { Entity } from "src/app/_models/base/entity";
import { environment } from "src/environments/environment";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { transform, transformToHttpParams } from "src/app/_models/base/paramUtils";
import { ParamRecord } from "src/app/_utils/serviceHelper/paramRecord";
import { getPaginatedResponse, PaginatedResponse } from "src/app/_utils/serviceHelper/pagination/paginatedResponse";
import { getFormHeaderText } from "src/app/_models/forms/formUtils";
import { FormUse } from "src/app/_models/forms/formTypes";
import { ConfirmService } from "src/app/_services/confirm/confirm.service";
import { DevService } from "../../_services/dev.service";
import { SelectionService } from "src/app/_models/services/selection.service";
import DetailDialog from "src/app/_models/base/components/types/detailDialog";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { ClickLinkHandler } from "src/app/_utils/serviceHelper/clickLinkHandler";

/**
 * A helper class that provides common service functionalities for handling entities, parameters, forms, etc.
 *
 * @template T - The entity type that extends `Entity`.
 * @template U - The parameter type that extends `EntityParams<U>` and implements `IParams`.
 * @template V - The form group type that extends `FormGroup2<U>`.
 * @template W - The detail dialog type that extends `DetailDialog<T>`.
 */
export class ServiceHelper<T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>, W extends Component = any> {
  protected http = inject(HttpClient);
  protected router = inject(Router);
  protected confirm = inject(ConfirmService);
  protected matSnackBar = inject(MatSnackBar);
  readonly dev = inject(DevService);

  private readonly selectionService: SelectionService<T> = inject(SelectionService<T>);

  matDialog = inject(MatDialog);
  readonly modalComponent?: Type<W>;

  clickLinkHandler?: ClickLinkHandler<T>;

  selected$ = (key: string) => this.selectionService.getSelection$(key);
  getSelected$ = (key: string) =>
    this.selectionService.getCurrentSelection(key) ? [ this.selectionService.getCurrentSelection(key)! ] : [];
  hasSelected$ = (key: string) => this.selectionService.hasSelection(key);
  setSelected$ = (key: string, value: T | null) => this.selectionService.setSelection(key, value);

  multipleSelected$ = (key: string) => this.selectionService.getMultipleSelections$(key);
  setMultipleSelected = (key: string, values: T[]) => this.selectionService.setMultipleSelections(key, values);
  toggleMultipleSelected$ = (key: string, value: T) => this.selectionService.toggleSelection(key, value);
  toggleMultipleSelectedArray$ = (key: string, values: T[]) => this.selectionService.toggleMultipleSelectArray(key, values);

  baseUrl: string;
  dictionary: NamingSubject;
  columns: Column[] = [];

  data = new BehaviorSubject<T[]>([]);
  data$ = this.data.asObservable();

  paginatedData: PaginatedResponse<T> | null = null;
  options = signal<SelectOption[]>([]);

  // We keep a simple param record for forms/parameters but no cache usage
  params = new BehaviorSubject<ParamRecord<T, U>>(new ParamRecord<T, U>(this.paramsConstructor));
  params$ = this.params.asObservable();

  constructor(
    private paramsConstructor: new (key: string) => U,
    controller: string,
    dictionary: NamingSubject,
    columns: Column[],
    modalComponent?: Type<W>,
  ) {
    this.baseUrl = `${environment.apiUrl}${controller.toLowerCase()}/`;
    this.dictionary = dictionary;
    this.modalComponent = modalComponent;
    effect(() => this.updateColumns(columns));
  }

  /**
   * Add ID column if development mode is enabled.
   * @param columns
   * @private
   */
  private updateColumns(columns: Column[]): void {
    this.columns = this.dev.isDev() ? [ columnId, ...columns ] : columns;
  }

  /**
   * Loads a paginated list of entities from the backend.
   */
  loadPagedList = (key: string | null, param: U): Observable<PaginatedResponse<T>> => {
    if (key === null) throw new Error("Key cannot be null");

    const payload: HttpParams = transformToHttpParams(transform(param));

    console.log('param: ', param);

    return getPaginatedResponse<T>(this.baseUrl, payload, this.http).pipe(
      tap((response) => {
        console.log(response);
        this.paginatedData = response;
        this.data.next(response.result);
      })
    );
  };

  /**
   * Returns the current data as an observable (ignoring the key).
   */
  list$(key: string | null): Observable<T[]> {
    if (key === null) throw new Error("Key cannot be null");
    return this.data;
  }

  /**
   * Toggles an item's "collapsed" state in this.data.
   */
  toggleCollapsedInService(id: number) {
    const updated = this.data.value.map((p) => {
      const collapsed = false;
      if (p.id === id) {
        return { ...p, isCollapsed: !p.isCollapsed };
      }
      return { ...p, isCollapsed: collapsed };
    });
    this.data.next(updated);
  }

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
      this.matDialog.open<W, DetailDialog<T>>(this.modalComponent, this.buildModalConfig(item, key, use, view));
    } else if (view === 'modal' && !this.modalComponent) {
      console.error("Modal component not defined during constructor initialization");
    } else {
      this.router.navigate([ this.dictionary.buildFromSiteSection(use, item?.id, siteSection) ]).then((): void => {});
    }
  }

  private buildModalConfig(item: T | null, key: string | null, use: FormUse = FormUse.DETAIL, view: View): MatDialogConfig<DetailDialog<T>> {
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
      hasBackdrop: false,
      panelClass: [ 'window' ]
    };
  }

  /**
   * Returns pagination info if `paginatedData` is set.
   */
  pagination$(key: string | null): Observable<Pagination | null> {
    if (key === null) throw new Error("Key cannot be null");
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
   */
  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}all/`).pipe(
      map((response) => {
        this.data.next(response);
        return response;
      })
    );
  }

  /**
   * Fetches an array of `SelectOption` objects.
   */
  getOptions(): Observable<SelectOption[]> {
    if (this.options().length > 0) {
      return of(this.options());
    }
    return this.http.get<SelectOption[]>(`${this.baseUrl}options`).pipe(
      map((response) => {
        this.options.set(response);
        return response;
      })
    );
  }

  /**
   * Gets a single entity by ID, checking local data first.
   */
  getById(id: number): Observable<T> {
    const item = this.data.value.find((a) => a.id === id);
    if (item) return of(item);

    return this.http.get<T>(`${this.baseUrl}${id}`).pipe(
      tap((response) => {
        this.data.next([ ...this.data.value, response ]);
      })
    );
  }

  /**
   * Retrieves an entity from local data only (returns null if not found).
   */
  getByIdFromData(id: number): T | null {
    return this.data.value.find((a) => a.id === id) ?? null;
  }

  /**
   * Creates a new entity on the server and updates local data/redirects if needed.
   */
  create(model: any, redirect: boolean = true): Observable<T> {
    return this.http.post<T>(this.baseUrl, model).pipe(
      tap((response) => {
        this.matSnackBar.open(`${this.dictionary.singularTitlecase} ${response.id}
        ${this.dictionary.articleSex === "feminine" ? "creada" : "creado"} correctamente`,
          "Cerrar",
          { duration: 3000 }
        );

        if (redirect) {
          this.router.navigate([ this.dictionary.catalogRoute, response.id ]).then(() => {});
        }

        this.data.next([ ...this.data.value, response ]);
      })
    );
  }

  /**
   * Updates an existing entity on the server and updates local data/redirects if needed.
   */
  update(model: any, id: number | null, redirect: boolean = true): Observable<T> {
    if (id === null) throw new Error("ID cannot be null");

    return this.http.put<T>(`${this.baseUrl}${id}`, model)
      .pipe(
        tap((response): void => {
          if (redirect) {
            this.router.navigate([ this.dictionary.catalogRoute, response.id ]).then(() => {});
          }

          this.matSnackBar.open(
            `${this.dictionary.singularTitlecase} ${response.id} actualizado correctamente`,
            "Cerrar",
            { duration: 3000 }
          );
          this.data.next(
            this.data.value.map((a) => (a.id === (id) ? response : a))
          );

          const options: SelectOption[] = this.options();
          const index: number = options.findIndex((o) => o.id === id);
          if (index !== -1) {
            const option: SelectOption = options[index];
            if (response.name) option.name = response.name;
            if (response.code) option.code = response.code;
            this.options.set(options);
          }
        })
      );
  }

  /**
   * (Placeholder) Resets the form. (No cache used.)
   */
  resetForm(key: string, form: V) {
  }

  /**
   * Deletes a single entity from the server and updates local data.
   */
  private delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`).pipe(
      tap(() => {
        this.data.next(this.data.value.filter((s) => s.id !== id));
      })
    );
  }

  /**
   * Confirms and deletes a single item.
   */
  delete$ = (item: T) => {
    this.confirm.confirm(this.getConfirmDeleteItem(item)).subscribe({
      next: (confirmed) => {
        if (confirmed) {
          this.delete(item.id!).subscribe({
            next: () => {
              this.matSnackBar.open(
                `${this.dictionary.articles.definedSingular} ${this.dictionary.singular} ${item.id} ha sido eliminado`,
                "Cerrar",
                { duration: 5000 }
              );
            },
            error: (error: any) => {
              this.matSnackBar.open(
                `Error eliminando ${this.dictionary.articles.definedPlural} ${this.dictionary.singular} ${item.id}.`
              );
              console.error(error);
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
    return this.http.delete<void>(`${this.baseUrl}range/${ids}`).pipe(tap(() => {}));
  }

  submitForm(key: string | null, params: U): void {
    this.loadPagedList(key, params).subscribe();
  }

  /**
   * (Placeholder) for deleting a range of items by key.
   */
  deleteRange$(key: string | null) {
    if (key === null) throw new Error("Key cannot be null");
    // Implementation logic for range deletion (if needed)
  }

  /**
   * Confirms and deletes multiple items by their IDs.
   */
  deleteRangeByIds$(ids: number[]): Observable<boolean> {
    return this.confirm.confirm(this.getConfirmDeleteRange(ids.length)).pipe(
      switchMap((result) => {
        if (result) {
          return this.deleteRange(ids.join(",")).pipe(
            map(() => {
              this.matSnackBar.open(
                `Los (${ids.length}) ${this.dictionary.plural} seleccionados fueron eliminados.`,
                "Cerrar",
                { duration: 5000 }
              );
              return true;
            }),
            catchError((error) => {
              this.matSnackBar.open(
                `Ocurrió un error eliminando los (${ids.length}) ${this.dictionary.plural}.`,
                "Cerrar",
                { duration: 5000 }
              );
              return of(false);
            })
          );
        }
        return of(false);
      })
    );
  }

  /**
   * (Placeholder) Returns a hard-coded string; no cache usage.
   */
  selectedIdsAsString = (key: string): string => "___";

  private getConfirmDeleteRange(count: number): Modal {
    return new Modal({
      btnCancelText: "Cancelar",
      btnOkText: "Eliminar",
      message: `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedPlural} (${count}) ${this.dictionary.plural} seleccionados?`,
      title: `Eliminar ${this.dictionary.plural}`,
    });
  }

  private getConfirmDeleteItem(item: T): Modal {
    return new Modal({
      btnCancelText: "Cancelar",
      btnOkText: "Eliminar",
      message: `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`,
      title: `Eliminar ${this.dictionary.singular}`,
    });
  }

  private getConfirmUpdateItem(item: T): Modal {
    return new Modal({
      btnCancelText: "Cancelar",
      btnOkText: "Actualizar",
      message: `¿Confirmas los cambios hechos en ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`,
      title: `Actualizar ${this.dictionary.singular}`,
    });
  }

  protected getFormHeaderText(use: FormUse, item: T | null): string {
    return getFormHeaderText(this.dictionary, use, item === null ? null : item.id);
  }
}
