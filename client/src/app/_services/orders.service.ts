import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { Modal } from "src/app/_models/modal";
import { PaginatedResult } from "src/app/_models/pagination";
import { Column, LoadingTypes, NamingSubjectType, SortOptions, View } from "src/app/_models/types";
import { Order, OrderParams } from "src/app/_models/order";
import { ConfirmService } from "src/app/_services/confirm.service";
import { downloadExcelFile, getItemsByKey, getPaginatedResult } from "src/app/_utils/util";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrdersService {
  private http = inject(HttpClient);
  private bsModalService = inject(BsModalService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);
  private toastr = inject(ToastrService);
  matSnackBar = inject(MatSnackBar);

  baseUrl = `${environment.apiUrl}orders/`;

  naming: NamingSubjectType = {
    singular: "orden",
    plural: "ordenes",
    pluralTitlecase: "Ordenes",
    singularTitlecase: "Orden",
    catalogRoute: "/home/orders",
    createRoute: "/home/orders/create",
    title: "Servicios",
    undefinedArticle: "uno",
    definedArticle: "lo",
    undefinedArticlePlural: "unos",
    definedArticlePlural: "los",
    articleSex: 'masculine',
  };

  columns: Column[] = [
    { label: "Fecha", name: "createdAt" },
    { label: "Total", name: "total" },
    { label: "Subtotal", name: "subtotal" },
    { label: "Descuento", name: "discount" },
    { label: "Impuesto", name: "tax" },
    { label: "Monto Pagado", name: "amountPaid" },
    { label: "Monto Pendiente", name: "amountDue" },
    { label: "Paciente", name: "patient" },
    { label: "Doctor", name: "doctor" },
    { label: "Dirección", name: "address" },
    { label: "Estado", name: "status" },
    { label: "Estado de Entrega", name: "deliveryStatus" },
  ];

  private cacheMap: Map<string, Map<string, PaginatedResult<Order[]>>> = new Map<string, Map<string, PaginatedResult<Order[]>>>();
  private cacheExists = (key: string): boolean => this.cacheMap.has(key);
  private getCache = (key: string): Map<string, PaginatedResult<Order[]>> => {
    if (!this.cacheExists(key)) this.cacheMap.set(key, new Map<string, PaginatedResult<Order[]>>());
    return this.cacheMap.get(key)!;
  };

  private paramsMap: Map<string, OrderParams> = new Map<string, OrderParams>();
  private paramsExists = (key: string): boolean => this.paramsMap.has(key);
  getParam = (key: string): OrderParams => {
    if (!this.paramsExists(key)) this.paramsMap.set(key, new OrderParams(key));
    return this.paramsMap.get(key)!;
  };
  private setParam = (key: string, value: OrderParams): void => {
    this.paramsMap.set(key, value);
  };

  // Paged List
  private pagedLists = new BehaviorSubject<{ [key: string]: PaginatedResult<Order[]> }>({});
  pagedLists$ = this.pagedLists.asObservable();
  pagedList$ = (key: string): Observable<PaginatedResult<Order[]>> => this.pagedLists$.pipe(map(pagedList => pagedList[key]));
  setPagedList = (key: string, value: PaginatedResult<Order[]>): void => this.pagedLists.next({
    ...this.pagedLists.value,
    [key]: value
  });

  // All
  private all = new BehaviorSubject<Order[]>([]);
  all$ = this.all.asObservable();

  // Current
  private current = new BehaviorSubject<Order | null>(null);
  current$ = this.current.asObservable();
  getCurrent = (): Order | null => this.current.value;

  // Params
  private params = new BehaviorSubject<{ [key: string]: OrderParams }>({});
  params$ = this.params.asObservable();
  param$ = (key: string): Observable<OrderParams> => this.params$.pipe(map(params => params[key]));
  setParam$ = (key: string, value: OrderParams): void => {
    this.params.next({ ...this.params.value, [key]: value });
    this.setParam(key, value);
  };
  resetParam = (key: string): void => this.params.next({ ...this.params.value, [key]: new OrderParams(key) });
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
    const items = getItemsByKey<Order>(key, this.cacheMap);
    // if all of them are already selected, then deselect all of them...
    // however if there's at least one that is not selected, then select all of them
    const allSelected = items.every((item) => item.isSelected);
    items.forEach((item) => item.isSelected = !allSelected);
  }

  private selectedMap = new Map<string, Order | undefined>();
  private getSelected = (key: string): Order | null => this.selectedMap.get(key) || null;
  private setSelected = (key: string, value: Order | undefined): void => {
    this.selectedMap.set(key, value);
    this.setSelected$(key, value);
  };
  private selecteds = new BehaviorSubject<{ [key: string]: Order | undefined }>({});
  selecteds$ = this.selecteds.asObservable();
  selected$ = (key: string): Observable<Order | undefined> => this.selecteds$.pipe(map(selecteds => selecteds[key]));
  getSelected$ = (key: string): Order[] => this.selecteds.value[key] ? [this.selecteds.value[key]!] : [];
  hasSelected$ = (key: string): boolean => this.selecteds.value[key] !== undefined;

  setSelected$ = (key: string, value: Order | undefined = undefined): void => {

    getItemsByKey<Order>(key, this.cacheMap).map((d) => d.isSelected = false);

    if (value) value.isSelected = true;

    this.selecteds.next({ ...this.selecteds.value, [key]: value });
  };

  resetSelected = (key: string): void => this.selecteds.next({ ...this.selecteds.value, [key]: undefined });
  resetSelecteds = (): void => this.selecteds.next({});

  private multipleSelectedMap = new Map<string, Order[]>();
  private getMultipleSelected = (key: string): Order[] => this.multipleSelectedMap.get(key) || [];
  private setMultipleSelected = (key: string, value: Order[]): void => {
    this.multipleSelectedMap.set(key, value);
    this.setMultipleSelected$(key, value);
  };
  private addSelected = (key: string, value: Order): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  private multipleSelecteds = new BehaviorSubject<{ [key: string]: Order[] }>({});
  multipleSelecteds$ = this.multipleSelecteds.asObservable();
  multipleSelected$ = (key: string): Observable<Order[]> => this.multipleSelecteds$.pipe(map(multipleSelecteds => multipleSelecteds[key]));
  setMultipleSelected$ = (key: string, value: Order[]): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: value
  });
  addSelected$ = (key: string, value: Order): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  resetMultipleSelected = (key: string): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: []
  });
  resetMultipleSelecteds = (): void => this.multipleSelecteds.next({});

  // Get Paged List
  loadPagedList(key: string, param: OrderParams): Observable<PaginatedResult<Order[]>> {
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

    return getPaginatedResult<Order[]>(this.baseUrl, params, this.http).pipe(
      tap(response => {
        this.getCache(key).set(mapKey, response);
        this.setPagedList(key, response);
        this.setLoading(key, false);
      })
    );
  }

  getAll(): Observable<Order[]> {
    this.setLoading("all", true);

    return this.http
      .get<Order[]>(`${this.baseUrl}all/`)
      .pipe(
        map((consecutives) => {
          this.all.next(consecutives);
          this.setLoading("all", false);
          return consecutives;
        })
      );
  }

  getById(id: number): Observable<Order> {
    this.setLoading("current", true);

    const found = this.findInCache(this.cacheMap, id);

    if (found) {
      this.current.next(found);
      this.setLoading("current", false);
      return of(found);
    }

    return this.http.get<Order>(`${this.baseUrl}${id}`).pipe(
      tap(response => {
        this.current.next(response);
        this.setLoading("current", false);
      })
    );
  }

  create(formData: FormData, view: View, key: string): Observable<Order> {
    return this.http.post<Order>(this.baseUrl, formData).pipe(
      tap(response => {
        this.loadPagedList(key, this.getParam(key)).pipe();
        this.setSelected(key, response);
        this.current.next(response);
        this.all.next([...this.all.value, response]);
        this.matSnackBar.open(`${this.naming.definedArticle} ${this.naming.singular} fue creado exitosamente`, "Cerrar", { duration: 3000 });
        if (view === "modal") {
        } else if (view === 'page') {
          this.router.navigate([this.naming.catalogRoute, response.id]);
        }
        return response;
      })
    );
  }

  update(id: number, formData: FormData): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}${id}`, formData).pipe(
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

  delete$ = (item: Order): Observable<boolean> => {
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
    const items = getItemsByKey<Order>(key, this.cacheMap);

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

  setCurrent(animal: Order) {
    this.current.next(animal);
  }

  setDateRange(key: string, dateRange: Date[]) {
    const updatedParams = { ...this.getParam(key) };
    updatedParams.dateFrom = dateRange[0] || null;
    updatedParams.dateTo = dateRange[1] || null;

    const newParams = new OrderParams(key);
    newParams.updateFromPartial(updatedParams);

    this.setParam(key, newParams);
  }

  private findInCache(cacheMap: Map<string, Map<string, PaginatedResult<Order[]>>>, id: number): Order | undefined {
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

  private getConfirmDeleteRange = (count: number) => new Modal(`Eliminar ${this.naming.plural}`, `¿Estás seguro que deseas eliminar ${this.naming.definedArticlePlural} (${count}) ${this.naming.plural} seleccionados?`);
  private getConfirmDeleteItem = (item: Order) => new Modal(`Eliminar ${this.naming.singular}`, `¿Estás seguro que deseas eliminar ${this.naming.definedArticle} ${this.naming.singular} (${item.id})?`);
  private getConfirmUpdateItem = (item: Order) => new Modal(`Actualizar ${this.naming.singular}`, `¿Confirmas ${this.naming.definedArticlePlural} cambios hechos en ${this.naming.definedArticle} ${this.naming.singular} (${item.id})?`);

  hasSelected = (key: string): boolean => {
    const items = getItemsByKey<Order>(key, this.cacheMap);
    return items.some((item) => item.isSelected) ?? false;
  };

  selectedCount = (key: string): number => getItemsByKey<Order>(key, this.cacheMap).filter((item) => item.isSelected).length ?? 0;

  selectedIdsAsString = (key: string): string => {
    const items = getItemsByKey<Order>(key, this.cacheMap);
    return items.filter((item) => item.isSelected).map((item) => item.id).join(",") || "";
  };

}
