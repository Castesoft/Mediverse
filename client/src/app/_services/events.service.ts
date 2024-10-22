import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { Router } from "@angular/router";
import {DateClickArg} from "@fullcalendar/interaction";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { BehaviorSubject, catchError, finalize, map, Observable, of, switchMap, tap } from "rxjs";
import { Modal } from "src/app/_models/modal";
import { PaginatedResult } from "src/app/_models/pagination";
import { CatalogMode, Column, FormUse, LoadingTypes, NamingSubject, Role, SortOptions, View } from "src/app/_models/types";
import { FilterForm, Event, EventParams, EventSummary, EventDoctorFields } from "src/app/_models/event";
import { ConfirmService } from "src/app/_services/confirm.service";
import { downloadExcelFile, getItemsByKey, getPaginatedResult } from "src/app/_utils/util";
import { EventDetailModalComponent, EventEditModalComponent, EventNewModalComponent, EventsCatalogModalComponent, EventsFilterModalComponent } from "src/app/events/modals";
import { environment } from "src/environments/environment";
import { UserParams, UserSummary } from "src/app/_models/user";

@Injectable({
  providedIn: "root",
})
export class EventsService {
  private http = inject(HttpClient);
  private bsModalService = inject(BsModalService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);
  snackbarService = inject(SnackbarService)

  baseUrl = `${environment.apiUrl}events/`;

  private detailModalRef: BsModalRef<EventDetailModalComponent> = new BsModalRef<EventDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private editModalRef: BsModalRef<EventEditModalComponent> = new BsModalRef<EventEditModalComponent>();
  hideEditModal = () => this.editModalRef.hide();
  private newModalRef: BsModalRef<EventNewModalComponent> = new BsModalRef<EventNewModalComponent>();
  hideNewModal = () => this.newModalRef.hide();
  private filterModalRef: BsModalRef<EventsFilterModalComponent> = new BsModalRef<EventsFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<EventsCatalogModalComponent> = new BsModalRef<EventsCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  dictionary = new NamingSubject(
    'masculine',
    'cita',
    'citas',
    'Citas',
    'events',
    ['home', 'events'],
  );

  private cacheMap: Map<string, Map<string, PaginatedResult<Event[]>>> = new Map<string, Map<string, PaginatedResult<Event[]>>>();
  private cacheExists = (key: string): boolean => this.cacheMap.has(key);
  private getCache = (key: string): Map<string, PaginatedResult<Event[]>> => {
    if (!this.cacheExists(key)) this.cacheMap.set(key, new Map<string, PaginatedResult<Event[]>>());
    return this.cacheMap.get(key)!;
  };

  private paramsMap: Map<string, EventParams> = new Map<string, EventParams>();
  private paramsExists = (key: string): boolean => this.paramsMap.has(key);
  getParam = (key: string): EventParams => {
    if (!this.paramsExists(key)) this.paramsMap.set(key, new EventParams(key));
    return this.paramsMap.get(key)!;
  };
  private setParam = (key: string, value: EventParams): void => {
    this.paramsMap.set(key, value);
  };

  // Summary Handlers
  private summaryCacheMap: Map<string, Map<string, EventSummary[]>> = new Map<string, Map<string, EventSummary[]>>();
  private summaryCacheExists = (key: string): boolean => this.summaryCacheMap.has(key);
  private getSummaryCache = (key: string): Map<string, EventSummary[]> => {
    if (!this.summaryCacheExists(key)) this.summaryCacheMap.set(key, new Map<string, EventSummary[]>());
    return this.summaryCacheMap.get(key)!;
  };
  private summaryMap = new Map<string, EventSummary[] | null>();
  private getSummary = (key: string): EventSummary[] => this.summaryMap.get(key) || [];
  private setSummary = (key: string, value: EventSummary[] | null): void => {
    this.summaryMap.set(key, value);
  };
  private summaries = new BehaviorSubject<{ [key: string]: EventSummary[] | null }>({});
  summaries$ = this.summaries.asObservable();
  summary$ = (key: string): Observable<EventSummary[] | null> => this.summaries$.pipe(map(summaries => summaries[key]));
  setSummary$ = (key: string, value: EventSummary[] | null): void => this.summaries.next({
    ...this.summaries.value,
    [key]: value
  });

  // Paged List
  private pagedLists = new BehaviorSubject<{ [key: string]: PaginatedResult<Event[]> }>({});
  pagedLists$ = this.pagedLists.asObservable();
  pagedList$ = (key: string): Observable<PaginatedResult<Event[]>> => this.pagedLists$.pipe(map(pagedList => pagedList[key]));
  setPagedList = (key: string, value: PaginatedResult<Event[]>): void => this.pagedLists.next({
    ...this.pagedLists.value,
    [key]: value
  });

  // All
  private all = new BehaviorSubject<Event[]>([]);
  all$ = this.all.asObservable();

  // Current
  private current = new BehaviorSubject<Event | null>(null);
  current$ = this.current.asObservable();
  getCurrent = (): Event | null => this.current.value;

  // Params
  private params = new BehaviorSubject<{ [key: string]: EventParams }>({});
  params$ = this.params.asObservable();
  param$ = (key: string): Observable<EventParams> => this.params$.pipe(map(params => params[key]));
  setParam$ = (key: string, value: EventParams): void => {
    this.params.next({ ...this.params.value, [key]: value });
    this.setParam(key, value);
  };
  resetParam = (key: string): void => this.params.next({ ...this.params.value, [key]: new EventParams(key) });
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
    const items = getItemsByKey<Event>(key, this.cacheMap);
    // if all of them are already selected, then deselect all of them...
    // however if there's at least one that is not selected, then select all of them
    const allSelected = items.every((item) => item.isSelected);
    items.forEach((item) => item.isSelected = !allSelected);
  }

  private selectedMap = new Map<string, Event | null>();
  private getSelected = (key: string): Event | null => this.selectedMap.get(key) || null;
  private setSelected = (key: string, value: Event | null): void => {
    this.selectedMap.set(key, value);
    this.setSelected$(key, value);
  };
  private selecteds = new BehaviorSubject<{ [key: string]: Event | null }>({});
  selecteds$ = this.selecteds.asObservable();
  selected$ = (key: string): Observable<Event | null> => this.selecteds$.pipe(map(selecteds => selecteds[key]));
  getSelected$ = (key: string): Event[] => this.selecteds.value[key] ? [this.selecteds.value[key]!] : [];
  hasSelected$ = (key: string): boolean => this.selecteds.value[key] !== null;

  setSelected$ = (key: string, value: Event | null): void => {

    getItemsByKey<Event>(key, this.cacheMap).map((d) => d.isSelected = false);

    if (value) value.isSelected = true;

    this.selecteds.next({ ...this.selecteds.value, [key]: value });
  };

  resetSelected = (key: string): void => this.selecteds.next({ ...this.selecteds.value, [key]: null });
  resetSelecteds = (): void => this.selecteds.next({});

  private multipleSelectedMap = new Map<string, Event[]>();
  private getMultipleSelected = (key: string): Event[] => this.multipleSelectedMap.get(key) || [];
  private setMultipleSelected = (key: string, value: Event[]): void => {
    this.multipleSelectedMap.set(key, value);
    this.setMultipleSelected$(key, value);
  };
  private addSelected = (key: string, value: Event): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  private multipleSelecteds = new BehaviorSubject<{ [key: string]: Event[] }>({});
  multipleSelecteds$ = this.multipleSelecteds.asObservable();
  multipleSelected$ = (key: string): Observable<Event[]> => this.multipleSelecteds$.pipe(map(multipleSelecteds => multipleSelecteds[key]));
  setMultipleSelected$ = (key: string, value: Event[]): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: value
  });
  addSelected$ = (key: string, value: Event): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  resetMultipleSelected = (key: string): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: []
  });
  resetMultipleSelecteds = (): void => this.multipleSelecteds.next({});

  // Get Paged List
  loadPagedList(role: Role, key: string, param: EventParams): Observable<PaginatedResult<Event[]>> {
    this.setLoading(key, true);
    this.cacheExists(key);

    const mapKey = Object.values(param).join("-");
    const response = this.getCache(key).get(mapKey);

    if (response) {
      this.setPagedList(key, response);
      this.setLoading(key, false);
      return of(response);
    }

    param.role = role;
    let params = param.toHttpParams();

    return getPaginatedResult<Event[]>(this.baseUrl, params, this.http).pipe(
      tap(response => {
        this.getCache(key).set(mapKey, response);
        this.setPagedList(key, response);
        this.setLoading(key, false);
      })
    );
  }

  getAll(): Observable<Event[]> {
    this.setLoading("all", true);

    return this.http
      .get<Event[]>(`${this.baseUrl}all/`)
      .pipe(
        map(response => {
          this.all.next(response);
          this.setLoading("all", false);
          return response;
        })
      );
  }

  getById(id: number): Observable<Event> {
    this.setLoading("current", true);

    const found = this.findInCache(this.cacheMap, id);

    if (found) {
      this.current.next(found);
      this.setLoading("current", false);
      return of(found);
    }

    return this.http.get<Event>(`${this.baseUrl}${id}`).pipe(
      tap(response => {
        this.current.next(response);
        this.setLoading("current", false);
      })
    );
  }

  getSummaryByValue(key: string, summaryParams: EventParams): Observable<EventSummary[]> {
    const { search } = summaryParams;

    this.setLoading(key, true);
    this.summaryCacheExists(key);

    let params = summaryParams.toHttpParams();

    const response = this.getSummaryCache(key).get(search ?? '');

    if (response) {
      this.setSummary(key, response);
      this.setLoading(key, false);
      return of(response);
    }

    return this.http.get<EventSummary[]>(`${this.baseUrl}summary`, {params}).pipe(
      tap(response => {
        this.getSummaryCache(key).set(search ?? '', response);
        this.setSummary(key, response);
        this.setLoading(key, false);
      }),
      finalize(() => this.setLoading(key, false))
    );
  }

  getById$(id: number, key: string, role: Role) {
    const found = this.findInCache(this.cacheMap, id);

    if (found) {
      return found;
    }

    this.loadPagedList(role, key, this.getParam(key)).subscribe();

    return found;
  }

  create(formData: any, role: Role, view: View, key: string): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, {...formData, role}).pipe(
      tap(response => {
        // TODO
        this.loadPagedList(role, key, this.getParam(key)).pipe();
        this.setSelected(key, response);
        this.current.next(response);
        this.all.next([...this.all.value, response]);
        if (role === "Patient") {
          this.snackbarService.success(`${this.dictionary.articles.definedSingular} ${this.dictionary.singular} con ${response?.doctor?.firstName} ${response?.doctor?.lastName} fue creado exitosamente`);
        } else {
          this.snackbarService.success(`${this.dictionary.articles.definedSingular} ${this.dictionary.singular} con ${response?.patient?.fullName} fue creado exitosamente`);
        }
        if (view === "modal") {
          this.hideNewModal();
        } else if (view === 'page') {
          this.router.navigate([this.dictionary.catalogRoute, response.id]);
        }
        return response;
      })
    );
  }

  update(id: number, formData: any): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}${id}`, formData).pipe(
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
    filterForm.patchValue(new EventParams(key));
    this.resetParam(key);
  }

  delete$ = (item: Event): Observable<boolean> => {
    return this.confirm.confirm(this.getConfirmDeleteItem(item)).pipe(
      switchMap(result => {
        if (result) {
          return this.delete(item.id).pipe(
            map(() => {
              this.snackbarService.success(`${this.dictionary.articles.definedSingular} ${this.dictionary.singular} ${item.id} ha sido eliminado`);
              return true;
            }),
            catchError(error => {
              this.snackbarService.error(`Error eliminando ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} ${item.id}.`);
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
    const items = getItemsByKey<Event>(key, this.cacheMap);

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
              this.snackbarService.success(`${this.dictionary.articles.definedPlural} (${ids.length}) ${this.dictionary.plural} seleccionados fueron eliminados.`)
              return true;
            }),
            catchError(error => {
              this.snackbarService.error(`Ocurrió un error eliminando ${this.dictionary.articles.definedPlural} (${ids.length}) ${this.dictionary.plural}.`);
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
        this.snackbarService.success(`Archivo XLSX de ${this.dictionary.plural} descargado`);
      },
      error: (error) => {
        this.snackbarService.error(`Error descargando archivo XLSX de ${this.dictionary.plural}`);
      }
    });
  }

  private downloadXLSX(key: string) {
    const param = this.getParam(key);
    const params = param.toHttpParams();
    return this.http.get(`${this.baseUrl}xlsx`, { responseType: "blob", params }).pipe(
      map(response => {
        downloadExcelFile(response, this.dictionary.title);
      }),
      catchError(error => {
        console.error("Error downloading XLSX:", error);
        throw error;
      })
    );
  }

  setCurrent(animal: Event) {
    this.current.next(animal);
  }

  setDateRange(key: string, dateRange: Date[]) {
    const updatedParams = { ...this.getParam(key) };
    updatedParams.dateFrom = dateRange[0] || null;
    updatedParams.dateTo = dateRange[1] || null;

    const newParams = new EventParams(key);
    newParams.updateFromPartial(updatedParams);

    this.setParam(key, newParams);
  }

  private findInCache(cacheMap: Map<string, Map<string, PaginatedResult<Event[]>>>, id: number): Event | undefined {
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
    this.catalogModalRef = this.bsModalService.show(EventsCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { mode: mode, key: key } });
  };

  showFiltersModal = (key: string, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(EventsFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, title: title } });
  };

  clickLink = (id: number | null = null, item: Event | null = null, key: string | null = null, use: FormUse = "detail", view: View,
               dateFrom: Date | undefined = undefined, dateTo: Date | undefined = undefined) => {
    if (view === "modal") {
      if (id) {
        switch (use) {
          case "detail":
            this.detailModalRef = this.bsModalService.show(EventDetailModalComponent,
              {
                class: "modal-dialog-centered modal-lg",
                initialState: { id: id, use: use, item: item, key: key }
              } as ModalOptions<EventDetailModalComponent>);
            break;
          case "edit":
            this.editModalRef = this.bsModalService.show(EventEditModalComponent,
              {
                class: "modal-dialog-centered modal-lg",
                initialState: { id: id, use: use, item: item, key: key }
              } as ModalOptions<EventEditModalComponent>);
            break;
        }
      } else {
        this.newModalRef = this.bsModalService.show(EventNewModalComponent,
          {
            class: "modal-dialog-centered mw-650px",
            backdrop: 'static',
            initialState: { use: use, dateFrom: dateFrom, dateTo: dateTo, title: `Nueva ${this.dictionary.singular}` }
          } as ModalOptions<EventNewModalComponent>);
      }
    } else {
      switch (use) {
        case "create":
          this.router.navigate([this.dictionary.createRoute]);
          break;
        case "edit":
          this.router.navigate([`${this.dictionary.catalogRoute}/${id}/edit`]);
          break;
        case "detail":
          this.router.navigate([`${this.dictionary.catalogRoute}/${id}`]);
          break;
      }
    }
  };

  private getConfirmDeleteRange = (count: number) => new Modal(`Eliminar ${this.dictionary.plural}`, `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedPlural} (${count}) ${this.dictionary.plural} seleccionados?`);
  private getConfirmDeleteItem = (item: Event) => new Modal(`Eliminar ${this.dictionary.singular}`, `¿Estás seguro que deseas eliminar ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`);
  private getConfirmUpdateItem = (item: Event) => new Modal(`Actualizar ${this.dictionary.singular}`, `¿Confirmas ${this.dictionary.articles.definedPlural} cambios hechos en ${this.dictionary.articles.definedSingular} ${this.dictionary.singular} (${item.id})?`);

  hasSelected = (key: string): boolean => {
    const items = getItemsByKey<Event>(key, this.cacheMap);
    return items.some((item) => item.isSelected) ?? false;
  };

  selectedCount = (key: string): number => getItemsByKey<Event>(key, this.cacheMap).filter((item) => item.isSelected).length ?? 0;

  selectedIdsAsString = (key: string): string => {
    const items = getItemsByKey<Event>(key, this.cacheMap);
    return items.filter((item) => item.isSelected).map((item) => item.id).join(",") || "";
  };

  columns: Column[] = [
    { label: "Paciente", name: "name", options: { justify: 'center' } },
    { label: "Edad", name: "age" },
    { label: "Sexo", name: "sex" },
    { label: "Fecha de la consulta", name: "createdAt" },
  ]

  columnsPatientDetails: Column[] = [
    { label: "Servicio", name: "service" },
    { label: "Fecha de la consulta", name: "dateFrom" },
    { label: "Estado", name: "status" },
    { label: "Especialistas", name: "specialists" },
  ]

  getDoctorFields = (): Observable<EventDoctorFields> => {
    return this.http.get<EventDoctorFields>(`${this.baseUrl}doctor-fields`);
  };

  updateEvent = (id: number, request: {evolution?: string, nextSteps?: string}): Observable<Event> => {
    return this.http.put<Event>(`${this.baseUrl}${id}`, request);
  };

}
