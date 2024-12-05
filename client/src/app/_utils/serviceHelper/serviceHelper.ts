import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, signal } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of, tap, map, switchMap, catchError, debounceTime, take, finalize } from "rxjs";
import { Pagination } from "src/app/_utils/serviceHelper/pagination/pagination";
import { downloadExcelFile } from "src/app/_utils/util";
import { environment } from "src/environments/environment";
import { MatDialog } from "@angular/material/dialog";
import { CacheItem } from "src/app/_utils/serviceHelper/cacheItem";
import { ParamRecord } from "src/app/_utils/serviceHelper/paramRecord";
import { Cache } from "src/app/_utils/serviceHelper/cache";
import { getPaginatedResponse, PaginatedResponse } from "src/app/_utils/serviceHelper/pagination/paginatedResponse";
import { SelectOption } from "src/app/_models/base/selectOption";
import { NamingSubject } from "src/app/_models/base/namingSubject";
import { Column } from "src/app/_models/base/column";
import { CatalogMode, View } from "src/app/_models/base/types";
import { SortOptions } from "src/app/_models/base/sortOptions";
import { transform, transformToHttpParams } from "src/app/_models/base/paramUtils";
import { FormGroup2 } from "src/app/_models/forms/formGroup2";
import { EntityParams } from "src/app/_models/base/entityParams";
import { Entity } from "src/app/_models/base/entity";
import { SubmitOptions } from "src/app/_models/forms/extensions/baseFormComponent";
import { FormUse } from "src/app/_models/forms/formTypes";
import { getFormHeaderText } from "src/app/_models/forms/formUtils";
import { ConfirmService } from "src/app/_services/confirm.service";
import { Modal } from "src/app/_models/modal";

/**
 * A helper class that provides common service functionalities for handling entities, parameters, forms, and caching.
 *
 * @template T - The entity type that extends `Entity`.
 * @template U - The parameter type that extends `EntityParams<U>`.
 * @template V - The form group type that extends `FormGroup2<U>`.
 *
 * @remarks
 * This class includes methods for:
 * - Managing HTTP requests for entities.
 * - Handling caching mechanisms for data and parameters.
 * - Providing observable streams for data, parameters, and cache.
 * - Interacting with modals, dialogs, and snack bars for user notifications.
 * - Implementing pagination, sorting, and selection functionalities.
 * - Validating uniqueness of entity names.
 *
 * @example
 * ```typescript
 * // Instantiate ServiceHelper with custom entity, parameters, and form group types
 * const serviceHelper = new ServiceHelper<MyEntity, MyParams, MyFormGroup>(
 *   MyParams,
 *   'my-controller',
 *   myDictionary,
 *   myColumns
 * );
 * ```
 */
export class ServiceHelper<T extends Entity, U extends EntityParams<U>, V extends FormGroup2<U>> {
  protected http = inject(HttpClient);
  protected matDialog = inject(MatDialog);
  protected router = inject(Router);
  protected confirm = inject(ConfirmService);
  protected matSnackBar = inject(MatSnackBar);

  constructor(
    private paramsConstructor: new (key: string) => U,
    controller: string,
    dictionary: NamingSubject,
    columns: Column[]
  ) {
    this.baseUrl = `${environment.apiUrl}${controller.toLowerCase()}/`;
    this.dictionary = dictionary;
    this.columns = columns;

    this.params = new BehaviorSubject<ParamRecord<T, U>>(new ParamRecord<T,U>(this.paramsConstructor));
    this.cache = new BehaviorSubject<Cache<T, U>>(new Cache<T, U>(this.paramsConstructor));
    this.params$ = this.params.asObservable();
    this.cache$ = this.cache.asObservable();
  }

  baseUrl: string;
  dictionary: NamingSubject;
  columns: Column[];

  data = new BehaviorSubject<T[]>([]);
  data$ = this.data.asObservable();

  options = signal<SelectOption[]>([]);

  params: BehaviorSubject<ParamRecord<T, U>>;
  params$: Observable<ParamRecord<T, U>>;

  cache: BehaviorSubject<Cache<T, U>>;
  cache$: Observable<Cache<T, U>>;


  setKey(key: string): void {
    if (!this.cache.value.hasEntry(key)) {
      this.cache.next(this.cache.value.add(key, this.cache.value.entries[key].type));
    }
  }

  next(): void {
    this.cache.next(this.cache.value);
  }

  loadPagedList = (key: string | null, param: U): Observable<PaginatedResponse<T>> => {
    if (key === null) throw new Error('Key cannot be null');
    if (this.cache.value.hasEntry(key)) {
      if (this.cache.value.entries[key].count > 0) {
        this.cache.value.getParamValues(key).forEach(x => {
          if(x !== param.paramsValue) {
            this.cache.value.entries[key].entries[x].setCurrent(false);
          }
        });
      }
    }

    if (this.cache.value.hasPagedList(key, param.paramsValue)) {
      return of(this.cache.value.createPaginatedResult(key, param, this.data.value));
    }

    const payload = transformToHttpParams(transform(param));

    return getPaginatedResponse<T>(this.baseUrl, payload, this.http).pipe(
      tap(response => {
        if (this.cache.value.hasEntry(key)) {
          if (this.cache.value.entries[key].hasEntry(param.paramsValue)) {
            if (this.cache.value.entries[key].entries[param.paramsValue].ids.length === 0) {
              this.cache.value.entries[key].entries[param.paramsValue].setIdsAndPagination(response);
            }
          }
        }
        for (const item of response.result) {
          if (!this.data.value.find(a => a.id === item.id)) {
            this.data.next([...this.data.value, item]);
          }
        }
      })
    );
  };

  createEntry = (key: string | null, value: U, type: CatalogMode): void => {
    if (key === null) throw new Error('Key cannot be null');
    this.cache.next(this.cache.value.createEntry(key, value, type));
  };

  param$(key: string | null, type: CatalogMode): Observable<U> {
    if (key === null) throw new Error('Key cannot be null');
    if (!this.cache.value.hasEntry(key)) {
      this.cache.next(this.cache.value.add(key, type));
    }

    return this.cache$.pipe(
      map(cache => {
        return cache.entries[key].getParam();
      })
    )
  }

  list$(key: string | null, type: CatalogMode): Observable<T[]> {
    if (key === null) throw new Error('Key cannot be null');
    return this.cache$.pipe(
      map(cache => {
        if (cache.hasEntry(key)) {
          if (this.cache.value.entries[key].hasCurrent) {
            const selectedIds = cache.entries[key].selected;
            const items = cache.entries[key].getCurrent()!.ids.map(a => {
              const dataItem = this.data.value.find(b => b.id === a.id)!;
              return {
                ...dataItem,
                isSelected: selectedIds.includes(a.id)
              };
            });
            return items;
          }
        }
        return [];
      })
    );
  }


  pagination$(key: string | null): Observable<Pagination | null> {
    if (key === null) throw new Error('Key cannot be null');
    return this.cache$.pipe(
      map(cache => {
        if (cache.hasEntry(key)) {
          if (cache.entries[key].hasCurrent) {
            return cache.entries[key].getCurrent()!.pagination!;
          }
        }
        return null;
      })
    );
  }

  resetParam = (key: string): void => this.params.next(this.params.value.reset(key));

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}all/`).pipe(
      map(response => {
        this.data.next(response);
        return response;
      })
    );
  }

  getOptions(): Observable<SelectOption[]> {
    if (this.options().length > 0) {
      return of(this.options());
    }

    return this.http.get<SelectOption[]>(`${this.baseUrl}options`).pipe(
      map(response => {
        this.options.set(response);
        return response;
      })
    )
  }

  getById(id: number): Observable<T> {
    const item = this.data.value.find(a => a.id === id);

    if (item) return of(item);

    return this.http.get<T>(`${this.baseUrl}${id}`).pipe(
      tap(response => {
        this.data.next([...this.data.value, response]);
      })
    );
  }

  create(form: FormGroup2<T>, view: View, model?: any): Observable<T> {
    return this.http.post<T>(this.baseUrl, model ?? form.value).pipe(
      tap(response => {
        this.matSnackBar.open(`${this.dictionary.singularTitlecase} ${response.id} creado correctamente`, 'Cerrar', { duration: 3000 });
        this.router.navigate([this.dictionary.catalogRoute, response.id]);
        this.data.next([...this.data.value, response]);
      })
    );
  }

  update(form: FormGroup2<T>, view: View, _options?: Partial<SubmitOptions>): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${_options?.id ?? form.controls.id.value}`, _options?.value ?? form.value).pipe(
      tap(response => {
        if (view === 'page') {
          this.router.navigate([this.dictionary.catalogRoute, response.id]);
        }
        this.matSnackBar.open(`${this.dictionary.singularTitlecase} ${response.id} actualizado correctamente`, 'Cerrar', { duration: 3000 });

        const id = _options?.id;

        if (id !== undefined) {
          this.data.next(this.data.value.map(a => a.id === (id ?? form.controls.id.value) ? response : a));
        }

        const options = this.options();
        const index = options.findIndex(o => o.id === id);
        if (index !== -1) {
          const option = options[index];

          if (response.name) option.name = response.name;
          if (response.code) option.code = response.code;

          // options[index] = updatedOption;
          this.options.set(options);
        }
      })
    );
  }

  loadMore(key: string | null) {
    if (key === null) throw new Error('Key cannot be null');
    let current = this.cache.value.getParam(key);
    let target = current;
    target.pageNumber = 1;
    target.pageSize = 50;
    if (!this.cache.value.entries[key].hasEntry(target.paramsValue)) {
      this.cache.value.entries[key].entries[target.paramsValue] = new CacheItem<T, U>(target);
    }
    this.cache.value.entries[key].entries[target.paramsValue].setCurrent(true);
    this.cache.value.entries[key].entries[target.paramsValue].setParams(target);
    this.cache.next(this.cache.value);
  }

  loadLess(key: string | null) {
    if (key === null) throw new Error('Key cannot be null');
    let current = this.cache.value.getParam(key);
    let target = current;
    target.pageSize = 10;
    if (!this.cache.value.entries[key].hasEntry(target.paramsValue)) {
      this.cache.value.entries[key].entries[target.paramsValue] = new CacheItem<T, U>(target);
    }
    this.cache.value.entries[key].entries[target.paramsValue].setCurrent(true);
    this.cache.value.entries[key].entries[target.paramsValue].setParams(target);
    this.cache.next(this.cache.value);
  }

  onPageChanged(key: string | null, event: any) {
    if (key === null) throw new Error('Key cannot be null');
    let current = this.cache.value.getParam(key);
    if (current.pageNumber !== event.pageIndex + 1) {
      let target = current;
      target.pageNumber = event.pageIndex + 1;
      if (!this.cache.value.entries[key].hasEntry(target.paramsValue)) {
        this.cache.value.entries[key].entries[target.paramsValue] = new CacheItem<T, U>(target);
      }
      this.cache.value.entries[key].entries[target.paramsValue].setCurrent(true);
      this.cache.value.entries[key].entries[target.paramsValue].setParams(target);
      this.cache.next(this.cache.value);
    }
  }

  downloadXLSX$(key: string) {
    this.downloadXLSX(key).subscribe({
      next: () => {
        this.matSnackBar.open(`Archivo XLSX de ${this.dictionary.plural} descargado`, "Cerrar", { duration: 3000 });
      },
      error: (error) => {
        this.matSnackBar.open(`Error descargando archivo XLSX de ${this.dictionary.plural}`, "Cerrar", { duration: 3000 });
      }
    });
  }

  private downloadXLSX(key: string) {
    const param = this.cache.value.getParam(key);

    const payload = transformToHttpParams(transform(param));

    return this.http.get(`${this.baseUrl}xlsx`, { responseType: "blob", params: payload, }).pipe(
      map(response => {
        downloadExcelFile(response, this.dictionary.title);
      }),
      catchError(error => {
        console.error("Error downloading XLSX:", error);
        throw error;
      })
    );
  }

  validateNameUnique(current?: string): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if(current && control.value === current) {
        return of(null);
      }
      return control.valueChanges.pipe(
        debounceTime(300),
        take(1),
        switchMap(() => {
          return this.nameExists(control.value).pipe(
            map(result => result ? { nameExists: true } : null),
            finalize(() => {
              control.markAsTouched();
            })
          )
        })
      )
    }
  }

  nameExists(name: string): Observable<boolean> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('name', name);

    return this.http.get<boolean>(`${this.baseUrl}nameExists`, { params: httpParams });
  }

  hasSelected(key: string | null, type: CatalogMode): Observable<boolean> {
    if (key === null) throw new Error('Key cannot be null');
    return this.cache$.pipe(
      map(cache => {
        if (cache.hasEntry(key)) {
          return cache.entries[key].selected.length > 0;
        }
        return false;
      })
    );
  }

  areAllSelected(key: string | null): Observable<boolean> {
    if (key === null) throw new Error('Key cannot be null');
    return this.cache$.pipe(
      map(cache => {
        if (cache.hasEntry(key)) {
          const items = cache.entries[key].getCurrent()!.ids;
          return items.length > 0 && items.every(item => item.isSelected);
        }
        return false;
      })
    );
  }


  onSelectAll(key: string | null, type: CatalogMode, isSelected: boolean): void {
    if (key === null) throw new Error('Key cannot be null');
    if (this.cache.value.hasEntry(key)) {
      this.cache.value.entries[key].onSelectAll(this.cache.value.entries[key].getParam().paramsValue, isSelected);
      this.next();
    }
  }

  onSelect(key: string | null, type: CatalogMode, item: T): void {
    if (key === null) throw new Error('Key cannot be null');
    if (this.cache.value.hasEntry(key)) {
      const current = this.cache.value.entries[key].getCurrent()!;
      const currentParam = current.params;
      const currentParamValue = currentParam.paramsValue;
      const target = current.ids.find(a => a.id === item.id)!;
      target.isSelected = !target.isSelected;

      if (target.isSelected) {
        if (!this.cache.value.entries[key].selected.includes(item.id!)) {
          this.cache.value.entries[key].selected.push(item.id!);
        }
      } else {
        this.cache.value.entries[key].selected = this.cache.value.entries[key].selected.filter(a => a !== item.id);
      }

      this.cache.next(this.cache.value);
    }
  }


  onSortOptionsChange = (key: string | null, options: SortOptions): void => {
    if (key === null) throw new Error('Key cannot be null');
    // const params = this.cache.value.getParam(key);
    // params.sort = options.sort;
    // params.isSortAscending = options.isSortAscending;
    // this.cache.value.createEntry(key, params);
  };

  submitForm(key: string | null, params: U) {
    if (key === null) throw new Error('Key cannot be null');
    let current = this.cache.value.getParam(key);
    if (current.paramsValue !== params.paramsValue) {
      let target = current;
      Object.assign(target, params);
      if (!this.cache.value.entries[key].hasEntry(target.paramsValue)) {
        this.cache.value.entries[key].entries[target.paramsValue] = new CacheItem<T, U>(target);
      }
      this.cache.value.entries[key].entries[target.paramsValue].setCurrent(true);
      this.cache.value.entries[key].entries[target.paramsValue].setParams(target);
      this.cache.next(this.cache.value);
    }
  }

  resetForm(key: string, form: V) {
    // TODO: Implement form reset
    // form.patch('create', new this.paramsConstructor(key));
    // this.resetParam(key);
  }

  private delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`).pipe(
      tap(() => {
        this.data.next(this.data.value.filter(s => s.id !== id));
      })
    );
  }

  delete$ = (item: T) => {
    this.confirm.confirm(this.getConfirmDeleteItem(item)).subscribe({
      next: confirm => {
        if (confirm) {
          this.delete(item.id!).subscribe({
            next: response => {
              this.matSnackBar.open(`${this.dictionary.articles.definedSingular} ${this.dictionary.singular} ${item.id} ha sido eliminado`, 'Cerrar', { duration: 5000 });
            },
            error: (error: any) => {
              this.matSnackBar.open(`Error eliminando ${this.dictionary.articles.definedPlural} ${this.dictionary.singular} ${item.id}.`);
              console.error(error);
            }
          })
        }
      }
    })
  };

  private deleteRange(ids: string) {
    return this.http.delete(`${this.baseUrl}range/${ids}`).pipe(
      tap(() => {})
    );
  }

  deleteRange$(key: string | null) {
    if (key === null) throw new Error('Key cannot be null');
    if (this.cache.value.hasEntry(key)) {
      this.deleteRangeByIds$(this.cache.value.entries[key].selected).subscribe();
    }
  }
  deleteRangeByIds$(ids: number[]): Observable<boolean> {
    return this.confirm.confirm(this.getConfirmDeleteRange(ids.length)).pipe(
      switchMap(result => {
        if (result) {
          return this.deleteRange(ids.join(',')).pipe(
            map(() => {
              this.matSnackBar.open(`Los (${ids.length}) ${this.dictionary.plural} seleccionados fueron eliminados.`, 'Cerrar', { duration: 5000 });
              return true;
            }),
            catchError(error => {
              this.matSnackBar.open(`Ocurrió un error eliminando los (${ids.length}) ${this.dictionary.plural}.`, 'Cerrar', { duration: 5000 });
              return of(false);
            }),
          );
        }
        return of(false);
      }),
    );
  }

  selectedCount(key: string | null, type: CatalogMode): Observable<number> {
    if (key === null) throw new Error('Key cannot be null');
    return this.cache$.pipe(
      map(cache => {
        if (cache.hasEntry(key)) {
          return cache.entries[key].selected.length;
        }
        return 0;
      })
    );
  }

  selectedIdsAsString = (key: string): string => '___';

  private getConfirmDeleteRange(count: number): Modal {
    return new Modal({
      btnCancelText: "Cancelar",
      btnOkText: "Eliminar",
      message: `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedPlural} (${count}) ${this.dictionary.plural} seleccionados?`,
      title: `Eliminar ${this.dictionary.plural}`
    })
  }

  private getConfirmDeleteItem(item: T): Modal {
    return new Modal({
      btnCancelText: "Cancelar",
      btnOkText: "Eliminar",
      message: `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`,
      title: `Eliminar ${this.dictionary.singular}`
    })
  }

  private getConfirmUpdateItem(item: T): Modal {
    return new Modal({
      btnCancelText: "Cancelar",
      btnOkText: "Actualizar",
      message: `¿Confirmas los cambios hechos en ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`,
      title: `Actualizar ${this.dictionary.singular}`
    })
  }

  protected getFormHeaderText(use: FormUse, item: T | null): string {
    return getFormHeaderText(this.dictionary, use, item === null ? null : item.id);
  }


}
