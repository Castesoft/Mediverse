import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, signal } from "@angular/core";
import { AbstractControl, AsyncValidatorFn } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { BehaviorSubject, Observable, of, tap, map, switchMap, catchError, debounceTime, take, finalize } from "rxjs";
import { Modal } from "src/app/_models/modal";
import { Pagination, PaginatedResponse, Item } from "src/app/_models/pagination";
import { Entity, EntityParams, IParams, NamingSubject, Column, SortOptions, CatalogMode, View } from "src/app/_models/types";
import { downloadExcelFile, getPaginatedResponse } from "src/app/_utils/util";
import { environment } from "src/environments/environment";
import { FormGroup2 } from "src/app/_forms/form2";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmService } from "src/app/_services/confirm.service";
import { SelectOption } from "src/app/_forms/form";

export class ParamRecord<T extends Entity, U extends EntityParams<U>> {
  entries: Record<string, U> = {};

  constructor(private paramConstructor: new (key: string) => U) {}
  // constructor(private paramConstructor: new (key: string, props?: { [K in keyof U]?: U[K] }) => U) {}

  add(key: string): ParamRecord<T, U> {
    if (this.hasKey(key)) return this;
    const params = new this.paramConstructor(key);
    this.entries[params.paramsValue] = params;
    return this;
  }

  set(key: string, value: U): ParamRecord<T, U> {
    this.entries[key] = value;
    return this;
  }

  get count(): number {
    return Object.keys(this.entries).length;
  }

  get keys(): string[] {
    return Object.keys(this.entries);
  }

  get values(): U[] {
    return Object.values(this.entries);
  }

  hasKey(key: string): boolean {
    return !!this.entries[key];
  }

  reset(key: string): ParamRecord<T, U> {
    const params = new this.paramConstructor(key)
    this.entries[params.paramsValue] = params;
    return this;
  }
}

export class CacheItem<T extends Entity, U extends EntityParams<U>> {
  current = false;
  params: U;
  pagination?: Pagination;
  ids: Item[] = [];

  constructor(params: U) {
    this.params = params;
  }

  setParams(params: U): void {
    this.params = params;
  }

  setCurrent(value: boolean): void {
    this.current = value;
  }
  setPagination(value: Pagination): void {
    this.pagination = value;
  }
  setIds(value: Item[]): void {
    this.ids = value;
  }
  setIdsAndPagination(response: PaginatedResponse<T>): void {
    this.ids = response.ids;
    this.pagination = response.pagination;
  }
};

export class CacheEntry<T extends Entity, U extends EntityParams<U>> {
  entries: Record<string, CacheItem<T, U>> = {};
  type: CatalogMode;
  selected: number[] = [];

  constructor(type: CatalogMode) {
    this.type = type;
  }

  onSelectAll(paramValue: string, isSelected: boolean): void {
    this.entries[paramValue].ids.forEach(a => {
      if (isSelected) {
        if (!this.selected.includes(a.id)) {
          this.selected.push(a.id);
        }
        this.entries[paramValue].ids.find(b => b.id === a.id)!.isSelected = true;
      } else {
        this.selected = this.selected.filter(b => b !== a.id);
        this.entries[paramValue].ids.find(b => b.id === a.id)!.isSelected = false;
      }
    });
  }

  set(response: PaginatedResponse<T> | undefined = undefined, currentParam: U, current = false) {
    const currentParamValue = currentParam.paramsValue;
    if (!this.hasEntry(currentParamValue)) {
      this.entries[currentParamValue] = new CacheItem<T, U>(currentParam);
    }
    this.entries[currentParamValue].params = currentParam;
    this.entries[currentParamValue].current = current;
    if (response) {
      this.entries[currentParamValue].pagination = response?.pagination;
      this.entries[currentParamValue].ids = response?.ids ?? [];
    }
  }

  hasEntry(paramValue: string): boolean {
    if (Object.keys(this.entries).length === 0) return false;
    for(const key of Object.keys(this.entries)) {
      if (key === paramValue) return true;
    }
    return false;
  }

  getParam(): U {
    const current = Object.values(this.entries).find(a => a.current)!;
    return current.params;
  }

  getCurrent(): CacheItem<T, U> | undefined {
    return Object.values(this.entries).find(a => a.current);
  }

  get hasCurrent(): boolean {
    return !!Object.values(this.entries).find(a => a.current);
  }

  getCurrentEntry(): CacheItem<T, U> {
    return Object.values(this.entries).find(a => a.current)!;
  }

  getByValue(paramValue: string): CacheItem<T, U> | undefined {
    if (!this.hasParam(paramValue)) return undefined;
    return this.entries[paramValue];
  }

  hasIds(): boolean {
    if (this.count === 0) return false;
    const current = this.getCurrent();
    return !!current?.ids.length;
  }

  get count(): number {
    return Object.keys(this.entries).length;
  }

  get keys(): string[] {
    return Object.keys(this.entries);
  }

  get values(): U[] {
    return Object.values(this.entries).map(a => a.params);
  }

  hasParam(param: string): boolean {
    return !!this.entries[param];
  }
}

export class Cache<T extends Entity, U extends EntityParams<U>> {
  entries: Record<string, CacheEntry<T, U>> = {};

  constructor(private paramConstructor: new (key: string) => U) {}

  add(key: string, type: CatalogMode): Cache<T, U> {
    if (this.hasEntry(key)) return this;
    const params = new this.paramConstructor(key);
    this.entries[key] = new CacheEntry<T, U>(type);
    this.entries[key].entries[params.paramsValue] = new CacheItem<T, U>(params);
    this.entries[key].entries[params.paramsValue].setCurrent(true);
    this.entries[key].entries[params.paramsValue].setParams(params);
    return this;
  }

  hasSelected(key: string): boolean {
    // return this.entries[key].getCurrent()?.ids.length > 0;
    return false;
  }

  selected(key: string): number[] {
    return this.entries[key].selected;
  }

  get values(): string[] {
    return Object.keys(this.entries);
  }

  getEntry(key: string): CacheEntry<T, U> {
    return this.entries[key];
  }

  hasEntry(key: string): boolean {
    return !!this.entries[key];
  }

  hasPagedList(key: string, paramsValue: string): boolean {
    if (this.hasEntry(key)) {
      if (this.entries[key].hasEntry(paramsValue)) {
        return this.entries[key].entries[paramsValue].ids.length > 0;
      }
    }

    return false;
  }

  getParamValues(key: string): string[] {
    return Object.keys(this.entries[key].entries);
  }

  getParam(key: string): U {
    return this.entries[key].getParam();
  }

  disableParam(key: string, param: string): Cache<T, U> {
    this.entries[key].entries[param].current = false;
    return this;
  }

  setParamState(key: string, param: string, value = false): Cache<T, U> {
    this.entries[key].entries[param].current = value;
    return this;
  }

  createEntry(key: string, value: U, type: CatalogMode): Cache<T, U> {
    if (!this.hasEntry(key)) {
      this.entries[key] = new CacheEntry<T, U>(type);
    }
    if (!this.entries[key].hasEntry(value.paramsValue)) {
      this.entries[key].entries[value.paramsValue] = new CacheItem<T, U>(value);
    }
    this.entries[key].entries[value.paramsValue].setCurrent(true);
    this.entries[key].entries[value.paramsValue].setParams(value);
    return this;
  }

  getItem(key: string, paramValue: string): CacheItem<T, U> {
    return this.entries[key].entries[paramValue];
  }

  hasParam(key: string, param: string): boolean {
    return !!this.entries[key].entries[param];
  }

  get count(): number {
    return Object.keys(this.entries).length;
  }

  hasIds(key: string): boolean {
    if (!this.hasEntry(key)) return false;
    const current = Object.values(this.entries[key].entries).find(a => a.current);
    return !!current?.ids.length;
  }

  createPaginatedResult(key: string, params: U, data: T[]): PaginatedResponse<T> {
    const item = this.getItem(key, params.paramsValue);
    this.entries[key].entries[params.paramsValue].setCurrent(true);
    const list = item.ids.map(({ id }) => data.find(a => a.id === id)!);
    return new PaginatedResponse<T>(list, item.pagination!);
  }

  setPaginatedResult(key: string, paramValue: string, response: PaginatedResponse<T>, params: U, current: boolean): Cache<T, U> {
    this.entries[key].entries[paramValue].setCurrent(current);
    this.entries[key].entries[paramValue].setParams(params);
    this.entries[key].entries[paramValue].setIdsAndPagination(response);
    return this;
  }
};

export class ServiceHelper<T extends Entity, U extends EntityParams<U> & IParams, V extends FormGroup2<U>> {
  protected http = inject(HttpClient);
  protected bsModalService = inject(BsModalService);
  protected matDialog = inject(MatDialog);
  protected router = inject(Router);
  protected confirm = inject(ConfirmService);
  protected matSnackBar = inject(MatSnackBar);

  baseUrl: string;
  dictionary: NamingSubject;
  columns: Column[];

  data = new BehaviorSubject<T[]>([]);
  data$ = this.data.asObservable();

  options = signal<SelectOption[]>([]);

  params = new BehaviorSubject<ParamRecord<T, U>>(new ParamRecord<T,U>(this.paramsConstructor));
  params$ = this.params.asObservable();

  cache = new BehaviorSubject<Cache<T, U>>(new Cache<T, U>(this.paramsConstructor));
  cache$ = this.cache.asObservable();

  constructor(
    private paramsConstructor: new (key: string) => U,
    controller: string,
    dictionary: NamingSubject,
    columns: Column[]
  ) {
    this.baseUrl = `${environment.apiUrl}${controller.toLowerCase()}/`;
    this.dictionary = dictionary;
    this.columns = columns;
  }

  setKey(key: string): void {
    if (!this.cache.value.hasEntry(key)) {
      this.cache.next(this.cache.value.add(key, this.cache.value.entries[key].type));
    }
  }

  next(): void {
    this.cache.next(this.cache.value);
  }

  loadPagedList = (key: string, param: U): Observable<PaginatedResponse<T>> => {
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

    return getPaginatedResponse<T>(this.baseUrl, param.httpParams, this.http).pipe(
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

  createEntry = (key: string, value: U, type: CatalogMode): void => {
    this.cache.next(this.cache.value.createEntry(key, value, type));
  };

  param$(key: string, type: CatalogMode): Observable<U> {
    if (!this.cache.value.hasEntry(key)) {
      this.cache.next(this.cache.value.add(key, type));
    }

    return this.cache$.pipe(
      map(cache => {
        return cache.entries[key].getParam();
      })
    )
  }

  list$(key: string, type: CatalogMode): Observable<T[]> {
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


  pagination$(key: string): Observable<Pagination | undefined> {
    return this.cache$.pipe(
      map(cache => {
        if (cache.hasEntry(key)) {
          if (cache.entries[key].hasCurrent) {
            return cache.entries[key].getCurrent()!.pagination!;
          }
        }
        return undefined;
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
        this.options.set(response.map(option => new SelectOption({...option})));
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

  update(form: FormGroup2<T>, view: View, id?: number, model?: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${id ?? form.controls.id.value}`, model ?? form.value).pipe(
      tap(response => {
        if (view === 'page') {
          this.router.navigate([this.dictionary.catalogRoute, response.id]);
        }
        this.matSnackBar.open(`${this.dictionary.singularTitlecase} ${response.id} actualizado correctamente`, 'Cerrar', { duration: 3000 });
        this.data.next(this.data.value.map(a => a.id === (id ?? form.controls.id.value) ? response : a));

        const options = this.options();
        const index = options.findIndex(o => o.id === id);
        if (index !== -1) {
          const option = options[index];

          option.name = response.name;
          option.code = response.code;

          // options[index] = updatedOption;
          this.options.set(options);
        }
      })
    );
  }

  loadMore(key: string) {
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

  loadLess(key: string) {
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

  onPageChanged(key: string, event: any) {
    let current = this.cache.value.getParam(key);
    if (current.pageNumber !== event) {
      let target = current;
      target.pageNumber = event;
      if (!this.cache.value.entries[key].hasEntry(target.paramsValue)) {
        this.cache.value.entries[key].entries[target.paramsValue] = new CacheItem<T, U>(target);
      }
      this.cache.value.entries[key].entries[target.paramsValue].setCurrent(true);
      this.cache.value.entries[key].entries[target.paramsValue].setParams(target);
      this.cache.next(this.cache.value);
    }
  }

  downloadXLSX$ = (key: string) => {
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
    return this.http.get(`${this.baseUrl}xlsx`, { responseType: "blob", params: param.httpParams }).pipe(
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

  hasSelected(key: string, type: CatalogMode): Observable<boolean> {
    return this.cache$.pipe(
      map(cache => {
        if (cache.hasEntry(key)) {
          return cache.entries[key].selected.length > 0;
        }
        return false;
      })
    );
  }

  areAllSelected(key: string): Observable<boolean> {
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


  onSelectAll(key: string, type: CatalogMode, isSelected: boolean): void {
    if (this.cache.value.hasEntry(key)) {
      this.cache.value.entries[key].onSelectAll(this.cache.value.entries[key].getParam().paramsValue, isSelected);
      this.next();
    }
  }

  onSelect(key: string, type: CatalogMode, item: T): void {
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


  onSortOptionsChange = (key: string, options: SortOptions): void => {
    // TODO: Implement sorting
    // const params = this.cache.value.getParam(key);
    // params.sort = options.sort;
    // params.isSortAscending = options.isSortAscending;
    // this.cache.value.createEntry(key, params);
  };

  submitForm(key: string, form: U) {
    let current = this.cache.value.getParam(key);
    if (current.paramsValue !== form.paramsValue) {
      let target = current;
      target.updateFromPartial(form);
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

  deleteRange$ = (key: string) => {

  };

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

  selectedCount(key: string, type: CatalogMode): Observable<number> {
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

  private getConfirmDeleteRange = (count: number) => new Modal(`Eliminar ${this.dictionary.plural}`, `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedPlural} (${count}) ${this.dictionary.plural} seleccionados?`);
  private getConfirmDeleteItem = (item: T) => new Modal(`Eliminar ${this.dictionary.singular}`, `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`);
  private getConfirmUpdateItem = (item: T) => new Modal(`Actualizar ${this.dictionary.singular}`, `¿Confirmas los cambios hechos en ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`);
}
