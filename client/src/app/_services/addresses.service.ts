import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { Modal } from "src/app/_models/modal";
import { PaginatedResult } from "src/app/_models/pagination";
import { Addresses, CatalogMode, Column, FormUse, LoadingTypes, NamingSubjectType, Role, SortOptions, View } from "src/app/_models/types";
import { FilterForm, Address, AddressParams } from "src/app/_models/address";
import { ConfirmService } from "src/app/_services/confirm.service";
import { downloadExcelFile, getItemsByKey, getPaginatedResult } from "src/app/_utils/util";
import { AddressDetailModalComponent, AddressEditModalComponent, AddressNewModalComponent, AddressesCatalogModalComponent, AddressesFilterModalComponent } from "src/app/addresses/modals";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AddressesService {
  private http = inject(HttpClient);
  private bsModalService = inject(BsModalService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);
  private toastr = inject(ToastrService);
  private matSnackBar = inject(MatSnackBar);

  baseUrl = `${environment.apiUrl}addresses/`;

  private detailModalRef: BsModalRef<AddressDetailModalComponent> = new BsModalRef<AddressDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private editModalRef: BsModalRef<AddressEditModalComponent> = new BsModalRef<AddressEditModalComponent>();
  hideEditModal = () => this.editModalRef.hide();
  private newModalRef: BsModalRef<AddressNewModalComponent> = new BsModalRef<AddressNewModalComponent>();
  hideNewModal = () => this.newModalRef.hide();
  private filterModalRef: BsModalRef<AddressesFilterModalComponent> = new BsModalRef<AddressesFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<AddressesCatalogModalComponent> = new BsModalRef<AddressesCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  namingDictionary = new Map<Addresses, NamingSubjectType>([
    ["Account", {
      singular: "dirección", plural: "direcciones", pluralTitlecase: "Direcciones", singularTitlecase: "Dirección",
      catalogRoute: "/account/addresses", createRoute: "/account/addresses/create",
      title: "Direcciones de envío", undefinedArticle: "una", definedArticle: "la", undefinedArticlePlural: "unas", definedArticlePlural: "las",
      articleSex: 'feminine',
    }],
    ["Clinic", {
      singular: "clínica", plural: "clínicas", pluralTitlecase: "Clínicas", singularTitlecase: "Clínica",
      catalogRoute: "/home/clinics", createRoute: "/home/clinics/create",
      title: "Clínicas", undefinedArticle: "una", definedArticle: "la", undefinedArticlePlural: "unas", definedArticlePlural: "las",
      articleSex: "feminine",
    }],
  ]);

  columnDictionary = new Map<Addresses, Column[]>([
    ["Account", [
      { label: "Dirección", name: "name"},
      { label: "Calle", name: "street" },
      { label: "Ciudad/Municipio", name: "city"},
      { label: "Código postal", name: "zipcode" },
      { label: "Estado", name: "state" },
    ]],
    ["Clinic", [
      { label: "Clínica", name: "name"},
      { label: "Dirección", name: "street" },
      { label: "Ciudad/Municipio", name: "city"},
      { label: "Especialistas", name: "nursesCount" },
      { label: " ", name: "isMain" },
    ]],
  ]);

  private cacheMap: Map<string, Map<string, PaginatedResult<Address[]>>> = new Map<string, Map<string, PaginatedResult<Address[]>>>();
  private cacheExists = (key: string): boolean => this.cacheMap.has(key);
  private getCache = (key: string): Map<string, PaginatedResult<Address[]>> => {
    if (!this.cacheExists(key)) this.cacheMap.set(key, new Map<string, PaginatedResult<Address[]>>());
    return this.cacheMap.get(key)!;
  };

  private paramsMap: Map<string, AddressParams> = new Map<string, AddressParams>();
  private paramsExists = (key: string): boolean => this.paramsMap.has(key);
  getParam = (key: string): AddressParams => {
    if (!this.paramsExists(key)) this.paramsMap.set(key, new AddressParams(key));
    return this.paramsMap.get(key)!;
  };
  private setParam = (key: string, value: AddressParams): void => {
    this.paramsMap.set(key, value);
  };

  // Paged List
  private pagedLists = new BehaviorSubject<{ [key: string]: PaginatedResult<Address[]> }>({});
  pagedLists$ = this.pagedLists.asObservable();
  pagedList$ = (key: string): Observable<PaginatedResult<Address[]>> => this.pagedLists$.pipe(map(pagedList => pagedList[key]));
  setPagedList = (key: string, value: PaginatedResult<Address[]>): void => this.pagedLists.next({
    ...this.pagedLists.value,
    [key]: value
  });

  // All
  private all = new BehaviorSubject<Address[]>([]);
  all$ = this.all.asObservable();

  // Current
  private current = new BehaviorSubject<Address | null>(null);
  current$ = this.current.asObservable();
  getCurrent = (): Address | null => this.current.value;

  // Params
  private params = new BehaviorSubject<{ [key: string]: AddressParams }>({});
  params$ = this.params.asObservable();
  param$ = (key: string): Observable<AddressParams> => this.params$.pipe(map(params => params[key]));
  setParam$ = (key: string, value: AddressParams): void => {
    this.params.next({ ...this.params.value, [key]: value });
    this.setParam(key, value);
  };
  resetParam = (key: string): void => this.params.next({ ...this.params.value, [key]: new AddressParams(key) });
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
    const items = getItemsByKey<Address>(key, this.cacheMap);
    // if all of them are already selected, then disselect all of them...
    // however if there's at least one that is not selected, then select all of them
    const allSelected = items.every((item) => item.isSelected);
    items.forEach((item) => item.isSelected = !allSelected);
  }

  private selectedMap = new Map<string, Address | undefined>();
  private getSelected = (key: string): Address | null => this.selectedMap.get(key) || null;
  private setSelected = (key: string, value: Address | undefined): void => {
    this.selectedMap.set(key, value);
    this.setSelected$(key, value);
  };
  private selecteds = new BehaviorSubject<{ [key: string]: Address | undefined }>({});
  selecteds$ = this.selecteds.asObservable();
  selected$ = (key: string): Observable<Address | undefined> => this.selecteds$.pipe(map(selecteds => selecteds[key]));
  getSelected$ = (key: string): Address[] => this.selecteds.value[key] ? [this.selecteds.value[key]!] : [];
  hasSelected$ = (key: string): boolean => this.selecteds.value[key] !== undefined;

  setSelected$ = (key: string, value: Address | undefined = undefined): void => {

    getItemsByKey<Address>(key, this.cacheMap).map((d) => d.isSelected = false);

    if (value) value.isSelected = true;

    this.selecteds.next({ ...this.selecteds.value, [key]: value });
  };

  resetSelected = (key: string): void => this.selecteds.next({ ...this.selecteds.value, [key]: undefined });
  resetSelecteds = (): void => this.selecteds.next({});

  private multipleSelectedMap = new Map<string, Address[]>();
  private getMultipleSelected = (key: string): Address[] => this.multipleSelectedMap.get(key) || [];
  private setMultipleSelected = (key: string, value: Address[]): void => {
    this.multipleSelectedMap.set(key, value);
    this.setMultipleSelected$(key, value);
  };
  private addSelected = (key: string, value: Address): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  private multipleSelecteds = new BehaviorSubject<{ [key: string]: Address[] }>({});
  multipleSelecteds$ = this.multipleSelecteds.asObservable();
  multipleSelected$ = (key: string): Observable<Address[]> => this.multipleSelecteds$.pipe(map(multipleSelecteds => multipleSelecteds[key]));
  setMultipleSelected$ = (key: string, value: Address[]): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: value
  });
  addSelected$ = (key: string, value: Address): void => {
    const selectedAddresses = this.getMultipleSelected(key);
    const index = selectedAddresses.findIndex(item => item.id === value.id);
    if (index === -1) {
      this.setMultipleSelected(key, [...selectedAddresses, value]);
    } else {
      selectedAddresses.splice(index, 1);
      this.setMultipleSelected(key, selectedAddresses);
    }
  };

  resetMultipleSelected = (key: string): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: []
  });

  // Get Paged List
  loadPagedList(type: Addresses, key: string, param: AddressParams): Observable<PaginatedResult<Address[]>> {
    this.setLoading(key, true);
    this.cacheExists(key);

    const mapKey = Object.values(param).join("-");
    const response = this.getCache(key).get(mapKey);

    if (response) {
      this.setPagedList(key, response);
      this.setLoading(key, false);
      return of(response);
    }

    param.type = type;
    let params = param.toHttpParams();

    return getPaginatedResult<Address[]>(this.baseUrl, params, this.http).pipe(
      tap(response => {
        this.getCache(key).set(mapKey, response);
        this.setPagedList(key, response);
        this.setLoading(key, false);
      })
    );
  }

  getAll(): Observable<Address[]> {
    this.setLoading("all", true);

    return this.http
      .get<Address[]>(`${this.baseUrl}all/`)
      .pipe(
        map((consecutives) => {
          this.all.next(consecutives);
          this.setLoading("all", false);
          return consecutives;
        })
      );
  }

  getById(id: number, type: Addresses): Observable<Address> {
    this.setLoading("current", true);

    const found = this.findInCache(this.cacheMap, id);

    if (found) {
      this.current.next(found);
      this.setLoading("current", false);
      return of(found);
    }

    return this.http.get<Address>(`${this.baseUrl}${id}`).pipe(
      tap(response => {
        this.current.next(response);
        this.setLoading("current", false);
      })
    );
  }

  create(formData: FormData, type: Addresses, view: View, key: string): Observable<Address> {
    return this.http.post<Address>(`${this.baseUrl}${type}`, formData).pipe(
      tap(response => {
        // TODO
        this.loadPagedList(type, key, this.getParam(key)).pipe();
        this.setSelected(key, response);
        this.current.next(response);
        this.all.next([...this.all.value, response]);
        this.matSnackBar.open(`${this.namingDictionary.get(type)!.definedArticle} ${this.namingDictionary.get(type)!.singular} ${response.name} fue creado exitosamente`, "Cerrar", { duration: 3000 });
        if (view === "modal") {
          this.hideNewModal();
        } else if (view === 'page') {
          this.router.navigate([this.namingDictionary.get(type)!.catalogRoute, response.id]);
        }
        return response;
      }),
    );
  }

  update(id: number, formData: FormData, type: Addresses): Observable<Address> {
    return this.http.put<Address>(`${this.baseUrl}${id}`, formData).pipe(
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
    filterForm.patchValue(new AddressParams(key));
    this.resetParam(key);
  }

  delete$ = (item: Address, type: Addresses): Observable<boolean> => {
    return this.confirm.confirm(this.getConfirmDeleteItem(item, type)).pipe(
      switchMap(result => {
        if (result) {
          return this.delete(item.id).pipe(
            map(() => {
              this.toastr.success(`${this.namingDictionary.get(type)!.definedArticle} ${this.namingDictionary.get(type)!.singular} ${item.id} ha sido eliminado`);
              return true;
            }),
            catchError(error => {
              this.toastr.error(`Error eliminando ${this.namingDictionary.get(type)!.definedArticle} ${this.namingDictionary.get(type)!.singular} ${item.id}.`);
              console.error(error);
              return of(false);
            })
          );
        }
        return of(false);
      })
    );
  };

  deleteRange$ = (key: string, type: Addresses) => {
    const items = getItemsByKey<Address>(key, this.cacheMap);

    if (!items || items.length === 0) return;
    const selectedItems = items.filter((item) => item.isSelected);
    const selectedCount = selectedItems.length;
    if (selectedCount === 1) {
      const item = selectedItems[0];
      this.delete$(item, type).subscribe();
    } else if (selectedCount > 1) {
      const selectedIds = selectedItems.map((item) => item.id);
      this.deleteRangeByIds$(selectedIds, type).subscribe();
    }
  };

  deleteRangeByIds$(ids: number[], type: Addresses): Observable<boolean> {
    return this.confirm.confirm(this.getConfirmDeleteRange(ids.length, type)).pipe(
      switchMap(result => {
        if (result) {
          return this.deleteRange(ids.join(",")).pipe(
            map(() => {
              this.toastr.success(`${this.namingDictionary.get(type)!.definedArticlePlural} (${ids.length}) ${this.namingDictionary.get(type)!.plural} seleccionados fueron eliminados.`);
              return true;
            }),
            catchError(error => {
              this.toastr.error(`Ocurrió un error eliminando ${this.namingDictionary.get(type)!.definedArticlePlural} (${ids.length}) ${this.namingDictionary.get(type)!.plural}.`);
              return of(false);
            })
          );
        }
        return of(false);
      })
    );
  }

  downloadXLSX$ = (key: string, type: Addresses) => {
    this.downloadXLSX(key, type).subscribe({
      next: () => {
        this.matSnackBar.open(`Archivo XLSX de ${this.namingDictionary.get(type)!.plural} descargado`, "Cerrar", { duration: 3000 });
      },
      error: (error) => {
        this.matSnackBar.open(`Error descargando archivo XLSX de ${this.namingDictionary.get(type)!.plural}`, "Cerrar", { duration: 3000 });
      }
    });
  }

  private downloadXLSX(key: string, type: Addresses) {
    const param = this.getParam(key);
    const params = param.toHttpParams();
    return this.http.get(`${this.baseUrl}xlsx`, { responseType: "blob", params }).pipe(
      map(response => {
        downloadExcelFile(response, this.namingDictionary.get(type)!.title);
      }),
      catchError(error => {
        console.error("Error downloading XLSX:", error);
        throw error;
      })
    );
  }

  setCurrent(animal: Address) {
    this.current.next(animal);
  }

  setDateRange(key: string, dateRange: Date[]) {
    const updatedParams = { ...this.getParam(key) };
    updatedParams.dateFrom = dateRange[0] || null;
    updatedParams.dateTo = dateRange[1] || null;

    const newParams = new AddressParams(key);
    newParams.updateFromPartial(updatedParams);

    this.setParam(key, newParams);
  }

  private findInCache(cacheMap: Map<string, Map<string, PaginatedResult<Address[]>>>, id: number): Address | undefined {
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

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode, type: Addresses): void => {
    this.catalogModalRef = this.bsModalService.show(AddressesCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { type: type, mode: mode, key: key } });
  };

  showFiltersModal = (key: string, type: Addresses, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(AddressesFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, type: type, title: title } });
  };

  clickLink = (type: Addresses, id: number | null = null, item: Address | null = null, key: string | null = null, use: FormUse = "detail", view: View) => {
    if (view === "modal") {
      if (id) {
        switch (use) {
          case "detail":
            this.detailModalRef = this.bsModalService.show(AddressDetailModalComponent,
              {
                class: "modal-dialog-centered modal-lg",
                initialState: { id: id, use: use, item: item, key: key }
              } as ModalOptions<AddressDetailModalComponent>);
            break;
          case "edit":
            this.editModalRef = this.bsModalService.show(AddressEditModalComponent,
              {
                class: "modal-dialog-centered modal-lg",
                initialState: { id: id, use: use, item: item, key: key }
              } as ModalOptions<AddressEditModalComponent>);
            break;
        }
      } else {
        this.newModalRef = this.bsModalService.show(AddressNewModalComponent,
          {
            class: "modal-dialog-centered modal-lg",
            initialState: { use: use, type: type }
          } as ModalOptions<AddressNewModalComponent>);
      }
    } else {
      switch (use) {
        case "create":
          this.router.navigate([this.namingDictionary.get(type)!.createRoute]);
          break;
        case "edit":
          this.router.navigate([`${this.namingDictionary.get(type)!.catalogRoute}/${id}/edit`]);
          break;
        case "detail":
          this.router.navigate([`${this.namingDictionary.get(type)!.catalogRoute}/${id}`]);
          break;
      }
    }
  };

  private getConfirmDeleteRange = (count: number, type: Addresses) => new Modal(`Eliminar ${this.namingDictionary.get(type)!.plural}`, `¿Estás seguro que deseas eliminar ${this.namingDictionary.get(type)?.definedArticlePlural} (${count}) ${this.namingDictionary.get(type)!.plural} seleccionados?`);
  private getConfirmDeleteItem = (item: Address, type: Addresses) => new Modal(`Eliminar ${this.namingDictionary.get(type)!.singular}`, `¿Estás seguro que deseas eliminar ${this.namingDictionary.get(type)!.definedArticle} ${this.namingDictionary.get(type)!.singular} (${item.id})?`);
  private getConfirmUpdateItem = (item: Address, type: Addresses) => new Modal(`Actualizar ${this.namingDictionary.get(type)!.singular}`, `¿Confirmas ${this.namingDictionary.get(type)?.definedArticlePlural} cambios hechos en ${this.namingDictionary.get(type)!.definedArticle} ${this.namingDictionary.get(type)!.singular} (${item.id})?`);

  hasSelected = (key: string): boolean => {
    const items = getItemsByKey<Address>(key, this.cacheMap);
    return items.some((item) => item.isSelected) ?? false;
  };

  selectedCount = (key: string): number => getItemsByKey<Address>(key, this.cacheMap).filter((item) => item.isSelected).length ?? 0;

  selectedIdsAsString = (key: string): string => {
    const items = getItemsByKey<Address>(key, this.cacheMap);
    return items.filter((item) => item.isSelected).map((item) => item.id).join(",") || "";
  };
}
