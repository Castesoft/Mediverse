import { inject, Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { Event, FilterForm } from "src/app/_models/event";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CatalogMode, Column, FormUse, LoadingTypes, NamingSubject, SortOptions, View } from '../_models/types';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { Modal } from '../_models/modal';
import { PaginatedResult } from '../_models/pagination';
import { getItemsByKey, getPaginatedResult, downloadExcelFile } from '../_utils/util';
// import { PrescriptionDetailModalComponent, PrescriptionEditModalComponent, PrescriptionNewModalComponent, PrescriptionsFilterModalComponent, PrescriptionsCatalogModalComponent } from '../Prescriptions/modals';
import { ConfirmService } from './confirm.service';
import { Prescription, PrescriptionParams } from '../_models/prescription';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {
  private http = inject(HttpClient);
  private bsModalService = inject(BsModalService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);
  private snackbarService = inject(SnackbarService);

  baseUrl = `${environment.apiUrl}prescriptions/`;

  // private detailModalRef: BsModalRef<PrescriptionDetailModalComponent> = new BsModalRef<PrescriptionDetailModalComponent>();
  // hideDetailModal = () => this.detailModalRef.hide();
  // private editModalRef: BsModalRef<PrescriptionEditModalComponent> = new BsModalRef<PrescriptionEditModalComponent>();
  // hideEditModal = () => this.editModalRef.hide();
  // private newModalRef: BsModalRef<PrescriptionNewModalComponent> = new BsModalRef<PrescriptionNewModalComponent>();
  // hideNewModal = () => this.newModalRef.hide();
  // private filterModalRef: BsModalRef<PrescriptionsFilterModalComponent> = new BsModalRef<PrescriptionsFilterModalComponent>();
  // hideFilterModal = () => this.filterModalRef.hide();
  // private catalogModalRef: BsModalRef<PrescriptionsCatalogModalComponent> = new BsModalRef<PrescriptionsCatalogModalComponent>();
  // hideCatalogModal = () => this.catalogModalRef.hide();

  naming: NamingSubject = {
    singular: "receta", plural: "recetas", pluralTitlecase: "Recetas", singularTitlecase: "Receta",
    catalogRoute: "/home/prescriptions", createRoute: "/home/prescriptions/create",
    title: "Recetas", undefinedArticle: "una", definedArticle: "la", undefinedArticlePlural: "unas", definedArticlePlural: "las",
    articleSex: 'femenine',
  } as NamingSubject;

  columns: Column[] = [
    { label: "Paciente", name: "patient", options: { justify: 'center' } },
    { label: "Diagnóstico", name: "notes" },
    // { label: "Medicamentos", name: "items" },
    { label: "Creado", name: "createdAt" },
  ];

  private cacheMap: Map<string, Map<string, PaginatedResult<Prescription[]>>> = new Map<string, Map<string, PaginatedResult<Prescription[]>>>();
  private cacheExists = (key: string): boolean => this.cacheMap.has(key);
  private getCache = (key: string): Map<string, PaginatedResult<Prescription[]>> => {
    if (!this.cacheExists(key)) this.cacheMap.set(key, new Map<string, PaginatedResult<Prescription[]>>());
    return this.cacheMap.get(key)!;
  };

  private paramsMap: Map<string, PrescriptionParams> = new Map<string, PrescriptionParams>();
  private paramsExists = (key: string): boolean => this.paramsMap.has(key);
  getParam = (key: string): PrescriptionParams => {
    if (!this.paramsExists(key)) this.paramsMap.set(key, new PrescriptionParams(key));
    return this.paramsMap.get(key)!;
  };
  private setParam = (key: string, value: PrescriptionParams): void => {
    this.paramsMap.set(key, value);
  };

  // Paged List
  private pagedLists = new BehaviorSubject<{ [key: string]: PaginatedResult<Prescription[]> }>({});
  pagedLists$ = this.pagedLists.asObservable();
  pagedList$ = (key: string): Observable<PaginatedResult<Prescription[]>> => this.pagedLists$.pipe(map(pagedList => pagedList[key]));
  setPagedList = (key: string, value: PaginatedResult<Prescription[]>): void => this.pagedLists.next({
    ...this.pagedLists.value,
    [key]: value
  });

  // All
  private all = new BehaviorSubject<Prescription[]>([]);
  all$ = this.all.asObservable();

  // Current
  private current = new BehaviorSubject<Prescription | null>(null);
  current$ = this.current.asObservable();
  getCurrent = (): Prescription | null => this.current.value;

  // Params
  private params = new BehaviorSubject<{ [key: string]: PrescriptionParams }>({});
  params$ = this.params.asObservable();
  param$ = (key: string): Observable<PrescriptionParams> => this.params$.pipe(map(params => params[key]));
  setParam$ = (key: string, value: PrescriptionParams): void => {
    this.params.next({ ...this.params.value, [key]: value });
    this.setParam(key, value);
  };
  resetParam = (key: string): void => this.params.next({ ...this.params.value, [key]: new PrescriptionParams(key) });
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
    const items = getItemsByKey<Prescription>(key, this.cacheMap);
    // if all of them are already selected, then deselect all of them...
    // however if there's at least one that is not selected, then select all of them
    const allSelected = items.every((item) => item.isSelected);
    items.forEach((item) => item.isSelected = !allSelected);
  }

  private selectedMap = new Map<string, Prescription | undefined>();
  private getSelected = (key: string): Prescription | null => this.selectedMap.get(key) || null;
  private setSelected = (key: string, value: Prescription | undefined): void => {
    this.selectedMap.set(key, value);
    this.setSelected$(key, value);
  };
  private selecteds = new BehaviorSubject<{ [key: string]: Prescription | undefined }>({});
  selecteds$ = this.selecteds.asObservable();
  selected$ = (key: string): Observable<Prescription | undefined> => this.selecteds$.pipe(map(selecteds => selecteds[key]));
  getSelected$ = (key: string): Prescription[] => this.selecteds.value[key] ? [this.selecteds.value[key]!] : [];
  hasSelected$ = (key: string): boolean => this.selecteds.value[key] !== undefined;

  setSelected$ = (key: string, value: Prescription | undefined = undefined): void => {

    getItemsByKey<Prescription>(key, this.cacheMap).map((d) => d.isSelected = false);

    if (value) value.isSelected = true;

    this.selecteds.next({ ...this.selecteds.value, [key]: value });
  };

  resetSelected = (key: string): void => this.selecteds.next({ ...this.selecteds.value, [key]: undefined });
  resetSelecteds = (): void => this.selecteds.next({});

  private multipleSelectedMap = new Map<string, Prescription[]>();
  private getMultipleSelected = (key: string): Prescription[] => this.multipleSelectedMap.get(key) || [];
  private setMultipleSelected = (key: string, value: Prescription[]): void => {
    this.multipleSelectedMap.set(key, value);
    this.setMultipleSelected$(key, value);
  };
  private addSelected = (key: string, value: Prescription): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  private multipleSelecteds = new BehaviorSubject<{ [key: string]: Prescription[] }>({});
  multipleSelecteds$ = this.multipleSelecteds.asObservable();
  multipleSelected$ = (key: string): Observable<Prescription[]> => this.multipleSelecteds$.pipe(map(multipleSelecteds => multipleSelecteds[key]));
  setMultipleSelected$ = (key: string, value: Prescription[]): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: value
  });
  addSelected$ = (key: string, value: Prescription): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  resetMultipleSelected = (key: string): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: []
  });
  resetMultipleSelecteds = (): void => this.multipleSelecteds.next({});

  // Get Paged List
  loadPagedList(key: string, param: PrescriptionParams, noCache = false): Observable<PaginatedResult<Prescription[]>> {
    this.setLoading(key, true);
    this.cacheExists(key);

    const mapKey = Object.values(param).join("-");
    const response = this.getCache(key).get(mapKey);

    // if (response && !noCache) {
    //   this.setPagedList(key, response);
    //   this.setLoading(key, false);
    //   return of(response);
    // }

    let params = param.toHttpParams();

    return getPaginatedResult<Prescription[]>(this.baseUrl, params, this.http).pipe(
      tap(response => {
        this.getCache(key).set(mapKey, response);
        this.setPagedList(key, response);
        this.setLoading(key, false);
      })
    );
  }

  getAll(): Observable<Prescription[]> {
    this.setLoading("all", true);

    return this.http
      .get<Prescription[]>(`${this.baseUrl}all/`)
      .pipe(
        map((consecutives) => {
          this.all.next(consecutives);
          this.setLoading("all", false);
          return consecutives;
        })
      );
  }

  getById(id: number, options?: {noCache: boolean}): Observable<Prescription> {
    this.setLoading("current", true);

    const found = this.findInCache(this.cacheMap, id);

    // if (found && !options?.noCache) {
    //   this.current.next(found);
    //   this.setLoading("current", false);
    //   return of(found);
    // }

    return this.http.get<Prescription>(`${this.baseUrl}${id}`).pipe(
      tap(response => {
        this.current.next(response);
        this.setLoading("current", false);
      })
    );
  }

  create(formData: any, doctorId: number): Observable<Event> {
    console.log('formData', formData);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Event>(`${this.baseUrl}${doctorId}`, formData, { headers }).pipe(
      tap(response => {
        return response;
      })
    );
  }


  update(id: number, formData: any): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.baseUrl}${id}`, formData).pipe(
      tap(response => {
        // TODO
      })
    );
  }

  private delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${id}`).pipe(
      tap((res) => {
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

  // TODO Resolver
  // resetForm(key: string, filterForm: FilterForm) {
  //   filterForm.patchValue(new PrescriptionParams(key));
  //   this.resetParam(key);
  // }

  delete$ = (item: Prescription): Observable<boolean> => {
    return this.confirm.confirm(this.getConfirmDeleteItem(item)).pipe(
      switchMap(result => {
        if (result) {
          return this.delete(item.id).pipe(
            map(() => {
              this.snackbarService.success(`${this.naming.definedArticle} ${this.naming.singular} ${item.id} ha sido eliminada`);
              return true;
            }),
            catchError(error => {
              this.snackbarService.error(`Error eliminando ${this.naming.definedArticle} ${this.naming.singular} ${item.id}.`);
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
    const items = getItemsByKey<Prescription>(key, this.cacheMap);

    if (!items || items.length === 0) return;
    const selectedItems = items.filter((item) => item.isSelected);
    const selectedCount = selectedItems.length;
    if (selectedCount === 1) {
      const item = selectedItems[0];
      return this.delete$(item);
    } else if (selectedCount > 1) {
      const selectedIds = selectedItems.map((item) => item.id);
      return this.deleteRangeByIds$(selectedIds);
    } else {
      return of();
    }
  };

  deleteRangeByIds$(ids: number[]): Observable<boolean> {
    return this.confirm.confirm(this.getConfirmDeleteRange(ids.length)).pipe(
      switchMap(result => {
        if (result) {
          return this.deleteRange(ids.join(",")).pipe(
            map(() => {
              this.snackbarService.success(`${this.naming.definedArticlePlural} (${ids.length}) ${this.naming.plural} seleccionados fueron eliminados.`);
              return true;
            }),
            catchError(error => {
              this.snackbarService.error(`Ocurrió un error eliminando ${this.naming.definedArticlePlural} (${ids.length}) ${this.naming.plural}.`);
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
        this.snackbarService.success(`Archivo XLSX de ${this.naming.plural} descargado`);
      },
      error: (error) => {
        this.snackbarService.error(`Error descargando archivo XLSX de ${this.naming.plural}`);
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

  setCurrent(animal: Prescription) {
    this.current.next(animal);
  }

  setDateRange(key: string, dateRange: Date[]) {
    const updatedParams = { ...this.getParam(key) };
    updatedParams.dateFrom = dateRange[0] || null;
    updatedParams.dateTo = dateRange[1] || null;

    const newParams = new PrescriptionParams(key);
    newParams.updateFromPartial(updatedParams);

    this.setParam(key, newParams);
  }

  private findInCache(cacheMap: Map<string, Map<string, PaginatedResult<Prescription[]>>>, id: number): Prescription | undefined {
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

  // showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode): void => {
  //   this.catalogModalRef = this.bsModalService.show(PrescriptionsCatalogModalComponent,
  //     { class: "modal-dialog-centered modal-xl", initialState: { mode: mode, key: key } });
  // };

  // showFiltersModal = (key: string, title = "Filtros"): void => {
  //   this.filterModalRef = this.bsModalService.show(PrescriptionsFilterModalComponent,
  //     { class: "modal-dialog-centered", initialState: { key: key, title: title } });
  // };

  // clickLink = (id: number | null = null, item: Prescription | null = null, key: string | null = null, use: FormUse = "detail", view: View) => {
  //   if (view === "modal") {
  //     if (id) {
  //       switch (use) {
  //         case "detail":
  //           this.detailModalRef = this.bsModalService.show(PrescriptionDetailModalComponent,
  //             {
  //               class: "modal-dialog-centered modal-lg",
  //               initialState: { id: id, use: use, item: item, key: key }
  //             } as ModalOptions<PrescriptionDetailModalComponent>);
  //           break;
  //         case "edit":
  //           this.editModalRef = this.bsModalService.show(PrescriptionEditModalComponent,
  //             {
  //               class: "modal-dialog-centered modal-lg",
  //               initialState: { id: id, use: use, item: item, key: key }
  //             } as ModalOptions<PrescriptionEditModalComponent>);
  //           break;
  //       }
  //     } else {
  //       this.newModalRef = this.bsModalService.show(PrescriptionNewModalComponent,
  //         {
  //           class: "modal-dialog-centered modal-lg",
  //           initialState: { use: use }
  //         } as ModalOptions<PrescriptionNewModalComponent>);
  //     }
  //   } else {
  //     switch (use) {
  //       case "create":
  //         this.router.navigate([this.naming.createRoute]);
  //         break;
  //       case "edit":
  //         this.router.navigate([`${this.naming.catalogRoute}/${id}/edit`]);
  //         break;
  //       case "detail":
  //         this.router.navigate([`${this.naming.catalogRoute}/${id}`]);
  //         break;
  //     }
  //   }
  // };

  private getConfirmDeleteRange = (count: number) => new Modal(`Eliminar ${this.naming.plural}`, `¿Estás seguro que deseas eliminar ${this.naming.definedArticlePlural} (${count}) ${this.naming.plural} seleccionados?`);
  private getConfirmDeleteItem = (item: Prescription) => new Modal(`Eliminar ${this.naming.singular}`, `¿Estás seguro que deseas eliminar ${this.naming.definedArticle} ${this.naming.singular} (${item.id})?`);
  private getConfirmUpdateItem = (item: Prescription) => new Modal(`Actualizar ${this.naming.singular}`, `¿Confirmas ${this.naming.definedArticlePlural} cambios hechos en ${this.naming.definedArticle} ${this.naming.singular} (${item.id})?`);

  hasSelected = (key: string): boolean => {
    const items = getItemsByKey<Prescription>(key, this.cacheMap);
    return items.some((item) => item.isSelected) ?? false;
  };

  selectedCount = (key: string): number => getItemsByKey<Prescription>(key, this.cacheMap).filter((item) => item.isSelected).length ?? 0;

  selectedIdsAsString = (key: string): string => {
    const items = getItemsByKey<Prescription>(key, this.cacheMap);
    return items.filter((item) => item.isSelected).map((item) => item.id).join(",") || "";
  };
}
