import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { Modal } from "src/app/_models/modal";
import { PaginatedResult } from "src/app/_models/pagination";
import { CatalogMode, Column, FormUse, LoadingTypes, NamingSubjectType, Role, SortOptions, View } from "src/app/_models/types";
import { FilterForm, Service, ServiceParams } from "src/app/_models/service";
import { ConfirmService } from "src/app/_services/confirm.service";
import { downloadExcelFile, getItemsByKey, getPaginatedResult } from "src/app/_utils/util";
import { ServiceDetailModalComponent, ServiceEditModalComponent, ServiceNewModalComponent, ServicesCatalogModalComponent, ServicesFilterModalComponent } from "src/app/services/modals";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ServicesService {
  private http = inject(HttpClient);
  private bsModalService = inject(BsModalService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);
  private toastr = inject(ToastrService);
  matSnackBar = inject(MatSnackBar);

  baseUrl = `${environment.apiUrl}services/`;

  private detailModalRef: BsModalRef<ServiceDetailModalComponent> = new BsModalRef<ServiceDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private editModalRef: BsModalRef<ServiceEditModalComponent> = new BsModalRef<ServiceEditModalComponent>();
  hideEditModal = () => this.editModalRef.hide();
  private newModalRef: BsModalRef<ServiceNewModalComponent> = new BsModalRef<ServiceNewModalComponent>();
  hideNewModal = () => this.newModalRef.hide();
  private filterModalRef: BsModalRef<ServicesFilterModalComponent> = new BsModalRef<ServicesFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<ServicesCatalogModalComponent> = new BsModalRef<ServicesCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  naming: NamingSubjectType = {
    singular: "servicio", plural: "servicios", pluralTitlecase: "Servicios", singularTitlecase: "Servicio",
    catalogRoute: "/home/services", createRoute: "/home/services/create",
    title: "Servicios", undefinedArticle: "uno", definedArticle: "lo", undefinedArticlePlural: "unos", definedArticlePlural: "los",
    articleSex: 'masculine',
  };

  columns: Column[] = [
    { label: "Nombre", name: "name", options: { justify: 'center' } },
    { label: "Descripción", name: "description" },
    { label: "Precio", name: "price", options: { justify: 'end' } },
    { label: "Descuento", name: "discount" },
    { label: "Creado", name: "createdAt" },
  ];

  private cacheMap: Map<string, Map<string, PaginatedResult<Service[]>>> = new Map<string, Map<string, PaginatedResult<Service[]>>>();
  private cacheExists = (key: string): boolean => this.cacheMap.has(key);
  private getCache = (key: string): Map<string, PaginatedResult<Service[]>> => {
    if (!this.cacheExists(key)) this.cacheMap.set(key, new Map<string, PaginatedResult<Service[]>>());
    return this.cacheMap.get(key)!;
  };

  private paramsMap: Map<string, ServiceParams> = new Map<string, ServiceParams>();
  private paramsExists = (key: string): boolean => this.paramsMap.has(key);
  getParam = (key: string): ServiceParams => {
    if (!this.paramsExists(key)) this.paramsMap.set(key, new ServiceParams(key));
    return this.paramsMap.get(key)!;
  };
  private setParam = (key: string, value: ServiceParams): void => {
    this.paramsMap.set(key, value);
  };

  // Paged List
  private pagedLists = new BehaviorSubject<{ [key: string]: PaginatedResult<Service[]> }>({});
  pagedLists$ = this.pagedLists.asObservable();
  pagedList$ = (key: string): Observable<PaginatedResult<Service[]>> => this.pagedLists$.pipe(map(pagedList => pagedList[key]));
  setPagedList = (key: string, value: PaginatedResult<Service[]>): void => this.pagedLists.next({
    ...this.pagedLists.value,
    [key]: value
  });

  // All
  private all = new BehaviorSubject<Service[]>([]);
  all$ = this.all.asObservable();

  // Current
  private current = new BehaviorSubject<Service | null>(null);
  current$ = this.current.asObservable();
  getCurrent = (): Service | null => this.current.value;

  // Params
  private params = new BehaviorSubject<{ [key: string]: ServiceParams }>({});
  params$ = this.params.asObservable();
  param$ = (key: string): Observable<ServiceParams> => this.params$.pipe(map(params => params[key]));
  setParam$ = (key: string, value: ServiceParams): void => {
    this.params.next({ ...this.params.value, [key]: value });
    this.setParam(key, value);
  };
  resetParam = (key: string): void => this.params.next({ ...this.params.value, [key]: new ServiceParams(key) });
  resetParams = (): void => this.params.next({});

  // Loading
  private loadings = new BehaviorSubject<{ [key: LoadingTypes]: boolean }>({});
  loadings$ = this.loadings.asObservable();
  loading$ = (key: string): Observable<boolean> => this.loadings$.pipe(map(loadings => loadings[key]));
  private setLoading = (key: LoadingTypes, value: boolean): void => this.loadings.next({
    ...this.loadings.value,
    [key]: value
  });

  selectAll(key: string, event: any) {
    const items = getItemsByKey<Service>(key, this.cacheMap);
    // if all of them are already selected, then disselect all of them...
    // however if there's at least one that is not selected, then select all of them
    const allSelected = items.every((item) => item.isSelected);
    items.forEach((item) => item.isSelected = !allSelected);
  }

  private selectedMap = new Map<string, Service | undefined>();
  private getSelected = (key: string): Service | null => this.selectedMap.get(key) || null;
  private setSelected = (key: string, value: Service | undefined): void => {
    this.selectedMap.set(key, value);
    this.setSelected$(key, value);
  };
  private selecteds = new BehaviorSubject<{ [key: string]: Service | undefined }>({});
  selecteds$ = this.selecteds.asObservable();
  selected$ = (key: string): Observable<Service | undefined> => this.selecteds$.pipe(map(selecteds => selecteds[key]));
  getSelected$ = (key: string): Service[] => this.selecteds.value[key] ? [this.selecteds.value[key]!] : [];
  hasSelected$ = (key: string): boolean => this.selecteds.value[key] !== undefined;

  setSelected$ = (key: string, value: Service | undefined = undefined): void => {

    getItemsByKey<Service>(key, this.cacheMap).map((d) => d.isSelected = false);

    if (value) value.isSelected = true;

    this.selecteds.next({ ...this.selecteds.value, [key]: value });
  };

  resetSelected = (key: string): void => this.selecteds.next({ ...this.selecteds.value, [key]: undefined });
  resetSelecteds = (): void => this.selecteds.next({});

  private multipleSelectedMap = new Map<string, Service[]>();
  private getMultipleSelected = (key: string): Service[] => this.multipleSelectedMap.get(key) || [];
  private setMultipleSelected = (key: string, value: Service[]): void => {
    this.multipleSelectedMap.set(key, value);
    this.setMultipleSelected$(key, value);
  };
  private addSelected = (key: string, value: Service): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  private multipleSelecteds = new BehaviorSubject<{ [key: string]: Service[] }>({});
  multipleSelecteds$ = this.multipleSelecteds.asObservable();
  multipleSelected$ = (key: string): Observable<Service[]> => this.multipleSelecteds$.pipe(map(multipleSelecteds => multipleSelecteds[key]));
  setMultipleSelected$ = (key: string, value: Service[]): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: value
  });
  addSelected$ = (key: string, value: Service): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  resetMultipleSelected = (key: string): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: []
  });
  resetMultipleSelecteds = (): void => this.multipleSelecteds.next({});

  // Get Paged List
  loadPagedList(key: string, param: ServiceParams): Observable<PaginatedResult<Service[]>> {
    this.setLoading(key, true);
    this.cacheExists(key);

    const mapKey = Object.values(param).join("-");
    const response = this.getCache(key).get(mapKey);

    if (response) {
      this.setPagedList(key, response);
      this.setLoading(key, false);
      return of(response);
    }

    let params = param.toHttpParams();

    return getPaginatedResult<Service[]>(this.baseUrl, params, this.http).pipe(
      tap(response => {
        this.getCache(key).set(mapKey, response);
        this.setPagedList(key, response);
        this.setLoading(key, false);
      })
    );
  }

  getAll(): Observable<Service[]> {
    this.setLoading("all", true);

    return this.http
      .get<Service[]>(`${this.baseUrl}all/`)
      .pipe(
        map((consecutives) => {
          this.all.next(consecutives);
          this.setLoading("all", false);
          return consecutives;
        })
      );
  }

  getById(id: number): Observable<Service> {
    this.setLoading("current", true);

    const found = this.findInCache(this.cacheMap, id);

    if (found) {
      this.current.next(found);
      this.setLoading("current", false);
      return of(found);
    }

    return this.http.get<Service>(`${this.baseUrl}${id}`).pipe(
      tap(response => {
        this.current.next(response);
        this.setLoading("current", false);
      })
    );
  }

  create(formData: FormData, view: View, key: string): Observable<Service> {
    return this.http.post<Service>(this.baseUrl, formData).pipe(
      tap((response: Service) => {
        this.loadPagedList(key, this.getParam(key)).pipe();
        this.setSelected(key, response);
        this.current.next(response);
        this.all.next([...this.all.value, response]);
        this.matSnackBar.open(`${this.naming.definedArticle} ${this.naming.singular} ${response.name} fue creado exitosamente`, "Cerrar", { duration: 3000 });
        if (view === "modal") {
          this.hideNewModal();
        } else if (view === 'page') {
          this.router.navigate([this.naming.catalogRoute, response.id]);
        }
        return response;
      })
    );
  }

  update(id: number, formData: FormData): Observable<Service> {
    return this.http.put<Service>(`${this.baseUrl}${id}`, formData).pipe(
      tap(response => {
        // TODO
      })
    );
  }

  private delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`).pipe(
      tap(() => {
        // TODO
        this.current.next(null);
        this.all.next(this.all.value.filter(s => s.id !== id));
      })
    );
  }

  private deleteRange(ids: string) {
    return this.http.delete(`${this.baseUrl}range/${ids}`).pipe(
      tap(() => {
        // TODO
      })
    );
  }

  onSortOptionsChange = (key: string, options: SortOptions): void => {
    const params = this.getParam(key);
    if (!options.sort) params.sort = "createdAt";
    else params.sort = options.sort;
    params.isSortAscending = options.isSortAscending;
    this.setParam(key, params);
  };

  onPageChanged(key: string, event: any) {
    const params = this.getParam(key);
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.setParam(key, params);
      this.setParam$(key, params);
    }
  }

  loadMore(key: string) {
    const params = this.getParam(key);
    params.pageNumber = 1;
    params.pageSize = 50;
    this.setParam(key, params);
    this.setParam$(key, params);
  }

  loadLess(key: string) {
    const params = this.getParam(key);
    params.pageSize = 10;
    this.setParam(key, params);
    this.setParam$(key, params);
  }

  resetForm(key: string, filterForm: FilterForm) {
    filterForm.patchValue(new ServiceParams(key));
    this.resetParam(key);
  }

  delete$ = (item: Service): Observable<boolean> => {
    return this.confirm.confirm(this.getConfirmDeleteItem(item)).pipe(
      switchMap(result => {
        if (result) {
          return this.delete(item.id).pipe(
            map(() => {
              this.toastr.success(`${this.naming.definedArticle} ${this.naming.singular} ${item.id} ha sido eliminado`);
              return true;
            }),
            catchError(error => {
              this.toastr.error(`Error eliminando ${this.naming.definedArticle} ${this.naming.singular} ${item.id}.`);
              console.error(error);
              return of(false);
            })
          );
        }
        return of(false);
      })
    );
  };

  deleteRange$ = (key: string) => {
    const items = getItemsByKey<Service>(key, this.cacheMap);

    if (!items || items.length === 0) return;
    const selectedItems = items.filter((item) => item.isSelected);
    const selectedCount = selectedItems.length;
    if (selectedCount === 1) {
      const item = selectedItems[0];
      this.delete$(item).subscribe();
    } else if (selectedCount > 1) {
      const selectedIds = selectedItems.map((item) => item.id);
      this.deleteRangeByIds$(selectedIds).subscribe();
    }
  };

  deleteRangeByIds$(ids: number[]): Observable<boolean> {
    return this.confirm.confirm(this.getConfirmDeleteRange(ids.length)).pipe(
      switchMap(result => {
        if (result) {
          return this.deleteRange(ids.join(",")).pipe(
            map(() => {
              this.toastr.success(`${this.naming.definedArticlePlural} (${ids.length}) ${this.naming.plural} seleccionados fueron eliminados.`);
              return true;
            }),
            catchError(error => {
              this.toastr.error(`Ocurrió un error eliminando ${this.naming.definedArticlePlural} (${ids.length}) ${this.naming.plural}.`);
              return of(false);
            })
          );
        }
        return of(false);
      })
    );
  }

  downloadXLSX$ = (key: string) => {
    this.downloadXLSX(key).subscribe({
      next: () => {
        this.matSnackBar.open(`Archivo XLSX de ${this.naming.plural} descargado`, "Cerrar", { duration: 3000 });
      },
      error: (error) => {
        this.matSnackBar.open(`Error descargando archivo XLSX de ${this.naming.plural}`, "Cerrar", { duration: 3000 });
      }
    });
  }

  private downloadXLSX(key: string) {
    const param = this.getParam(key);
    const params = param.toHttpParams();
    return this.http.get(`${this.baseUrl}xlsx`, { responseType: "blob", params }).pipe(
      map(response => {
        downloadExcelFile(response, this.naming.title);
      }),
      catchError(error => {
        console.error("Error downloading XLSX:", error);
        throw error;
      })
    );
  }

  setCurrent(animal: Service) {
    this.current.next(animal);
  }

  setDateRange(key: string, dateRange: Date[]) {
    const updatedParams = { ...this.getParam(key) };
    updatedParams.dateFrom = dateRange[0] || null;
    updatedParams.dateTo = dateRange[1] || null;

    const newParams = new ServiceParams(key);
    newParams.updateFromPartial(updatedParams);

    this.setParam(key, newParams);
  }

  private findInCache(cacheMap: Map<string, Map<string, PaginatedResult<Service[]>>>, id: number): Service | undefined {
    for (const key of cacheMap.keys()) {
      const map = cacheMap.get(key);

      if (map) {
        for (const paginatedResult of map.values()) {
          if (paginatedResult && paginatedResult.result) {
            const found = paginatedResult.result.find(current => current.id === id);
            if (found) {
              return found;
            }
          }
        }
      }
    }
    return undefined;
  }

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode): void => {
    this.catalogModalRef = this.bsModalService.show(ServicesCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { mode: mode, key: key } });
  };

  showFiltersModal = (key: string, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(ServicesFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, title: title } });
  };

  clickLink = (id: number | null = null, item: Service | null = null, key: string | null = null, use: FormUse = "detail", view: View) => {
    if (view === "modal") {
      if (id) {
        switch (use) {
          case "detail":
            this.detailModalRef = this.bsModalService.show(ServiceDetailModalComponent,
              {
                class: "modal-dialog-centered modal-lg",
                initialState: { id: id, use: use, item: item, key: key }
              } as ModalOptions<ServiceDetailModalComponent>);
            break;
          case "edit":
            this.editModalRef = this.bsModalService.show(ServiceEditModalComponent,
              {
                class: "modal-dialog-centered modal-lg",
                initialState: { id: id, use: use, item: item, key: key }
              } as ModalOptions<ServiceEditModalComponent>);
            break;
        }
      } else {
        this.newModalRef = this.bsModalService.show(ServiceNewModalComponent,
          {
            class: "modal-dialog-centered modal-lg",
            initialState: { use: use }
          } as ModalOptions<ServiceNewModalComponent>);
      }
    } else {
      switch (use) {
        case "create":
          this.router.navigate([this.naming.createRoute]);
          break;
        case "edit":
          this.router.navigate([`${this.naming.catalogRoute}/${id}/edit`]);
          break;
        case "detail":
          this.router.navigate([`${this.naming.catalogRoute}/${id}`]);
          break;
      }
    }
  };

  private getConfirmDeleteRange = (count: number) => new Modal(`Eliminar ${this.naming.plural}`, `¿Estás seguro que deseas eliminar ${this.naming.definedArticlePlural} (${count}) ${this.naming.plural} seleccionados?`);
  private getConfirmDeleteItem = (item: Service) => new Modal(`Eliminar ${this.naming.singular}`, `¿Estás seguro que deseas eliminar ${this.naming.definedArticle} ${this.naming.singular} (${item.id})?`);
  private getConfirmUpdateItem = (item: Service) => new Modal(`Actualizar ${this.naming.singular}`, `¿Confirmas ${this.naming.definedArticlePlural} cambios hechos en ${this.naming.definedArticle} ${this.naming.singular} (${item.id})?`);

  hasSelected = (key: string): boolean => {
    const items = getItemsByKey<Service>(key, this.cacheMap);
    return items.some((item) => item.isSelected) ?? false;
  };

  selectedCount = (key: string): number => getItemsByKey<Service>(key, this.cacheMap).filter((item) => item.isSelected).length ?? 0;

  selectedIdsAsString = (key: string): string => {
    const items = getItemsByKey<Service>(key, this.cacheMap);
    return items.filter((item) => item.isSelected).map((item) => item.id).join(",") || "";
  };

}
