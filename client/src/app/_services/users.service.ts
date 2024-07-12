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
import { FilterForm, User, UserParams } from "src/app/_models/user";
import { ConfirmService } from "src/app/_services/confirm.service";
import { downloadExcelFile, getItemsByKey, getPaginatedResult } from "src/app/_utils/util";
import { UserDetailModalComponent, UserEditModalComponent, UserNewModalComponent, UsersCatalogModalComponent, UsersFilterModalComponent } from "src/app/users/modals";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private http = inject(HttpClient);
  private bsModalService = inject(BsModalService);
  private router = inject(Router);
  private confirm = inject(ConfirmService);
  private toastr = inject(ToastrService);
  matSnackBar = inject(MatSnackBar);

  baseUrl = `${environment.apiUrl}users/`;

  private detailModalRef: BsModalRef<UserDetailModalComponent> = new BsModalRef<UserDetailModalComponent>();
  hideDetailModal = () => this.detailModalRef.hide();
  private editModalRef: BsModalRef<UserEditModalComponent> = new BsModalRef<UserEditModalComponent>();
  hideEditModal = () => this.editModalRef.hide();
  private newModalRef: BsModalRef<UserNewModalComponent> = new BsModalRef<UserNewModalComponent>();
  hideNewModal = () => this.newModalRef.hide();
  private filterModalRef: BsModalRef<UsersFilterModalComponent> = new BsModalRef<UsersFilterModalComponent>();
  hideFilterModal = () => this.filterModalRef.hide();
  private catalogModalRef: BsModalRef<UsersCatalogModalComponent> = new BsModalRef<UsersCatalogModalComponent>();
  hideCatalogModal = () => this.catalogModalRef.hide();

  // init to role 'male' and 'female' for the naming subject type
  namingDictionary = new Map<Role, NamingSubjectType>([
    ["Admin", {
      singular: "admin", plural: "admins", pluralTitlecase: "Admins", singularTitlecase: "Admin",
      catalogRoute: "/home/admins", createRoute: "/home/admins/create",
      title: "Hembras", undefinedArticle: "una", definedArticle: "la", undefinedArticlePlural: "unas", definedArticlePlural: "las",
      articleSex: 'masculine',
    }],
    ["Staff", {
      singular: "staff", plural: "staff", pluralTitlecase: "Staff", singularTitlecase: "Staff",
      catalogRoute: "/home/staff", createRoute: "/home/staff/create",
      title: "Staff", undefinedArticle: "un", definedArticle: "el", undefinedArticlePlural: "unos", definedArticlePlural: "los",
      articleSex: "masculine",
    }],
    ["Doctor", {
      singular: "doctor", plural: "doctores", pluralTitlecase: "Doctores", singularTitlecase: "Doctor",
      catalogRoute: "/home/doctors", createRoute: "/home/doctors/create",
      title: "Doctores", undefinedArticle: "un", definedArticle: "el", undefinedArticlePlural: "unos", definedArticlePlural: "los",
      articleSex: "masculine",
    }],
    [ "Nurse", {
      singular: "enfermero", plural: "enfermeros", pluralTitlecase: "Enfermeros", singularTitlecase: "Enfermero",
      catalogRoute: "/home/nurses", createRoute: "/home/nurses/create",
      title: "Enfermeros", undefinedArticle: "un", definedArticle: "el", undefinedArticlePlural: "unos", definedArticlePlural: "los",
      articleSex: "masculine",
    }],
    [ "Patient", {
      singular: "paciente", plural: "pacientes", pluralTitlecase: "Pacientes", singularTitlecase: "Paciente",
      catalogRoute: "/home/patients", createRoute: "/home/patients/create",
      title: "Pacientes", undefinedArticle: "un", definedArticle: "el", undefinedArticlePlural: "unos", definedArticlePlural: "los",
      articleSex: "masculine",
    }],
  ]);

  private cacheMap: Map<string, Map<string, PaginatedResult<User[]>>> = new Map<string, Map<string, PaginatedResult<User[]>>>();
  private cacheExists = (key: string): boolean => this.cacheMap.has(key);
  private getCache = (key: string): Map<string, PaginatedResult<User[]>> => {
    if (!this.cacheExists(key)) this.cacheMap.set(key, new Map<string, PaginatedResult<User[]>>());
    return this.cacheMap.get(key)!;
  };

  private paramsMap: Map<string, UserParams> = new Map<string, UserParams>();
  private paramsExists = (key: string): boolean => this.paramsMap.has(key);
  getParam = (key: string): UserParams => {
    if (!this.paramsExists(key)) this.paramsMap.set(key, new UserParams(key));
    return this.paramsMap.get(key)!;
  };
  private setParam = (key: string, value: UserParams): void => {
    this.paramsMap.set(key, value);
  };

  // Paged List
  private pagedLists = new BehaviorSubject<{ [key: string]: PaginatedResult<User[]> }>({});
  pagedLists$ = this.pagedLists.asObservable();
  pagedList$ = (key: string): Observable<PaginatedResult<User[]>> => this.pagedLists$.pipe(map(pagedList => pagedList[key]));
  setPagedList = (key: string, value: PaginatedResult<User[]>): void => this.pagedLists.next({
    ...this.pagedLists.value,
    [key]: value
  });

  // All
  private all = new BehaviorSubject<User[]>([]);
  all$ = this.all.asObservable();

  // Current
  private current = new BehaviorSubject<User | null>(null);
  current$ = this.current.asObservable();
  getCurrent = (): User | null => this.current.value;

  // Params
  private params = new BehaviorSubject<{ [key: string]: UserParams }>({});
  params$ = this.params.asObservable();
  param$ = (key: string): Observable<UserParams> => this.params$.pipe(map(params => params[key]));
  setParam$ = (key: string, value: UserParams): void => {
    this.params.next({ ...this.params.value, [key]: value });
    this.setParam(key, value);
  };
  resetParam = (key: string): void => this.params.next({ ...this.params.value, [key]: new UserParams(key) });
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
    const items = getItemsByKey<User>(key, this.cacheMap);
    // if all of them are already selected, then disselect all of them...
    // however if there's at least one that is not selected, then select all of them
    const allSelected = items.every((item) => item.isSelected);
    items.forEach((item) => item.isSelected = !allSelected);
  }

  private selectedMap = new Map<string, User | undefined>();
  private getSelected = (key: string): User | null => this.selectedMap.get(key) || null;
  private setSelected = (key: string, value: User | undefined): void => {
    this.selectedMap.set(key, value);
    this.setSelected$(key, value);
  };
  private selecteds = new BehaviorSubject<{ [key: string]: User | undefined }>({});
  selecteds$ = this.selecteds.asObservable();
  selected$ = (key: string): Observable<User | undefined> => this.selecteds$.pipe(map(selecteds => selecteds[key]));
  getSelected$ = (key: string): User[] => this.selecteds.value[key] ? [this.selecteds.value[key]!] : [];
  hasSelected$ = (key: string): boolean => this.selecteds.value[key] !== undefined;

  setSelected$ = (key: string, value: User | undefined = undefined): void => {

    getItemsByKey<User>(key, this.cacheMap).map((d) => d.isSelected = false);

    if (value) value.isSelected = true;

    this.selecteds.next({ ...this.selecteds.value, [key]: value });
  };

  resetSelected = (key: string): void => this.selecteds.next({ ...this.selecteds.value, [key]: undefined });
  resetSelecteds = (): void => this.selecteds.next({});

  private multipleSelectedMap = new Map<string, User[]>();
  private getMultipleSelected = (key: string): User[] => this.multipleSelectedMap.get(key) || [];
  private setMultipleSelected = (key: string, value: User[]): void => {
    this.multipleSelectedMap.set(key, value);
    this.setMultipleSelected$(key, value);
  };
  private addSelected = (key: string, value: User): void => this.setMultipleSelected(key, [...this.getMultipleSelected(key), value]);
  private multipleSelecteds = new BehaviorSubject<{ [key: string]: User[] }>({});
  multipleSelecteds$ = this.multipleSelecteds.asObservable();
  multipleSelected$ = (key: string): Observable<User[]> => this.multipleSelecteds$.pipe(map(multipleSelecteds => multipleSelecteds[key]));
  setMultipleSelected$ = (key: string, value: User[]): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: value
  });
  addSelected$ = (key: string, value: User): void => {
    const selectedUsers = this.getMultipleSelected(key);
    const index = selectedUsers.findIndex(user => user.id === value.id);
    if (index === -1) {
      this.setMultipleSelected(key, [...selectedUsers, value]);
    } else {
      selectedUsers.splice(index, 1);
      this.setMultipleSelected(key, selectedUsers);
    }
  };

  resetMultipleSelected = (key: string): void => this.multipleSelecteds.next({
    ...this.multipleSelecteds.value,
    [key]: []
  });

  // Get Paged List
  loadPagedList(role: Role, key: string, param: UserParams): Observable<PaginatedResult<User[]>> {
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

    return getPaginatedResult<User[]>(this.baseUrl, params, this.http).pipe(
      tap(response => {
        this.getCache(key).set(mapKey, response);
        this.setPagedList(key, response);
        this.setLoading(key, false);
      })
    );
  }

  getAll(): Observable<User[]> {
    this.setLoading("all", true);

    return this.http
      .get<User[]>(`${this.baseUrl}all/`)
      .pipe(
        map((consecutives) => {
          this.all.next(consecutives);
          this.setLoading("all", false);
          return consecutives;
        })
      );
  }

  getById(id: number, role: Role): Observable<User> {
    this.setLoading("current", true);

    const found = this.findInCache(this.cacheMap, id);

    if (found) {
      this.current.next(found);
      this.setLoading("current", false);
      return of(found);
    }

    return this.http.get<User>(`${this.baseUrl}${id}`).pipe(
      tap(response => {
        this.current.next(response);
        this.setLoading("current", false);
      })
    );
  }

  create(formData: FormData, role: Role): Observable<User> {
    return this.http.post<User>(this.baseUrl, formData).pipe(
      tap((response: User) => {
        // TODO
        this.current.next(response);
        this.all.next([...this.all.value, response]);
      })
    );
  }

  update(id: number, formData: FormData, role: Role): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}${id}`, formData).pipe(
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
    filterForm.patchValue(new UserParams(key));
    this.resetParam(key);
  }

  delete$ = (item: User, role: Role): Observable<boolean> => {
    return this.confirm.confirm(this.getConfirmDeleteItem(item, role)).pipe(
      switchMap(result => {
        if (result) {
          return this.delete(item.id).pipe(
            map(() => {
              this.toastr.success(`${this.namingDictionary.get(role)!.definedArticle} ${this.namingDictionary.get(role)!.singular} ${item.id} ha sido eliminado`);
              return true;
            }),
            catchError(error => {
              this.toastr.error(`Error eliminando ${this.namingDictionary.get(role)!.definedArticle} ${this.namingDictionary.get(role)!.singular} ${item.id}.`);
              console.error(error);
              return of(false);
            })
          );
        }
        return of(false);
      })
    );
  };

  deleteRange$ = (key: string, role: Role) => {
    const items = getItemsByKey<User>(key, this.cacheMap);

    if (!items || items.length === 0) return;
    const selectedItems = items.filter((item) => item.isSelected);
    const selectedCount = selectedItems.length;
    if (selectedCount === 1) {
      const item = selectedItems[0];
      this.delete$(item, role).subscribe();
    } else if (selectedCount > 1) {
      const selectedIds = selectedItems.map((item) => item.id);
      this.deleteRangeByIds$(selectedIds, role).subscribe();
    }
  };

  deleteRangeByIds$(ids: number[], role: Role): Observable<boolean> {
    return this.confirm.confirm(this.getConfirmDeleteRange(ids.length, role)).pipe(
      switchMap(result => {
        if (result) {
          return this.deleteRange(ids.join(",")).pipe(
            map(() => {
              this.toastr.success(`${this.namingDictionary.get(role)!.definedArticlePlural} (${ids.length}) ${this.namingDictionary.get(role)!.plural} seleccionados fueron eliminados.`);
              return true;
            }),
            catchError(error => {
              this.toastr.error(`Ocurrió un error eliminando ${this.namingDictionary.get(role)!.definedArticlePlural} (${ids.length}) ${this.namingDictionary.get(role)!.plural}.`);
              return of(false);
            })
          );
        }
        return of(false);
      })
    );
  }

  downloadXLSX$ = (key: string, role: Role) => {
    this.downloadXLSX(key, role).subscribe({
      next: () => {
        this.matSnackBar.open(`Archivo XLSX de ${this.namingDictionary.get(role)!.plural} descargado`, "Cerrar", { duration: 3000 });
      },
      error: (error) => {
        this.matSnackBar.open(`Error descargando archivo XLSX de ${this.namingDictionary.get(role)!.plural}`, "Cerrar", { duration: 3000 });
      }
    });
  }

  private downloadXLSX(key: string, role: Role) {
    const param = this.getParam(key);
    const params = param.toHttpParams();
    return this.http.get(`${this.baseUrl}xlsx`, { responseType: "blob", params }).pipe(
      map(response => {
        downloadExcelFile(response, this.namingDictionary.get(role)!.title);
      }),
      catchError(error => {
        console.error("Error downloading XLSX:", error);
        throw error;
      })
    );
  }

  setCurrent(animal: User) {
    this.current.next(animal);
  }

  setDateRange(key: string, dateRange: Date[]) {
    const updatedParams = { ...this.getParam(key) };
    updatedParams.dateFrom = dateRange[0] || null;
    updatedParams.dateTo = dateRange[1] || null;

    const newParams = new UserParams(key);
    newParams.updateFromPartial(updatedParams);

    this.setParam(key, newParams);
  }

  private findInCache(cacheMap: Map<string, Map<string, PaginatedResult<User[]>>>, id: number): User | undefined {
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

  showCatalogModal = (event: MouseEvent, key: string, mode: CatalogMode, role: Role): void => {
    this.catalogModalRef = this.bsModalService.show(UsersCatalogModalComponent,
      { class: "modal-dialog-centered modal-xl", initialState: { role: role, mode: mode, key: key } });
  };

  showFiltersModal = (key: string, role: Role, title = "Filtros"): void => {
    this.filterModalRef = this.bsModalService.show(UsersFilterModalComponent,
      { class: "modal-dialog-centered", initialState: { key: key, role: role, title: title } });
  };

  clickLink = (role: Role, id: number | null = null, item: User | null = null, key: string | null = null, use: FormUse = "detail", view: View) => {
    if (view === "modal") {
      if (id) {
        switch (use) {
          case "detail":
            this.detailModalRef = this.bsModalService.show(UserDetailModalComponent,
              {
                class: "modal-dialog-centered modal-lg",
                initialState: { id: id, use: use, item: item, key: key }
              } as ModalOptions<UserDetailModalComponent>);
            break;
          case "edit":
            this.editModalRef = this.bsModalService.show(UserEditModalComponent,
              {
                class: "modal-dialog-centered modal-lg",
                initialState: { id: id, use: use, item: item, key: key }
              } as ModalOptions<UserEditModalComponent>);
            break;
        }
      } else {
        this.newModalRef = this.bsModalService.show(UserNewModalComponent,
          {
            class: "modal-dialog-centered modal-lg",
            initialState: { use: use, role: role }
          } as ModalOptions<UserNewModalComponent>);
      }
    } else {
      switch (use) {
        case "create":
          this.router.navigate([this.namingDictionary.get(role)!.createRoute]);
          break;
        case "edit":
          this.router.navigate([`${this.namingDictionary.get(role)!.catalogRoute}/${id}/edit`]);
          break;
        case "detail":
          this.router.navigate([`${this.namingDictionary.get(role)!.catalogRoute}/${id}`]);
          break;
      }
    }
  };

  private getConfirmDeleteRange = (count: number, role: Role) => new Modal(`Eliminar ${this.namingDictionary.get(role)!.plural}`, `¿Estás seguro que deseas eliminar ${this.namingDictionary.get(role)?.definedArticlePlural} (${count}) ${this.namingDictionary.get(role)!.plural} seleccionados?`);
  private getConfirmDeleteItem = (item: User, role: Role) => new Modal(`Eliminar ${this.namingDictionary.get(role)!.singular}`, `¿Estás seguro que deseas eliminar ${this.namingDictionary.get(role)!.definedArticle} ${this.namingDictionary.get(role)!.singular} (${item.id})?`);
  private getConfirmUpdateItem = (item: User, role: Role) => new Modal(`Actualizar ${this.namingDictionary.get(role)!.singular}`, `¿Confirmas ${this.namingDictionary.get(role)?.definedArticlePlural} cambios hechos en ${this.namingDictionary.get(role)!.definedArticle} ${this.namingDictionary.get(role)!.singular} (${item.id})?`);

  hasSelected = (key: string): boolean => {
    const items = getItemsByKey<User>(key, this.cacheMap);
    return items.some((item) => item.isSelected) ?? false;
  };

  selectedCount = (key: string): number => getItemsByKey<User>(key, this.cacheMap).filter((item) => item.isSelected).length ?? 0;

  selectedIdsAsString = (key: string): string => {
    const items = getItemsByKey<User>(key, this.cacheMap);
    return items.filter((item) => item.isSelected).map((item) => item.id).join(",") || "";
  };

  columnDictionary = new Map<Role, Column[]>([
    ["Admin", [
      { label: "Admins", name: "name", options: { justify: 'center' } },
      { label: "Edad", name: "age" },
      { label: "Sexo", name: "sex", options: { justify: 'end' } },
      { label: "Cuenta", name: "hasAccount" },
      { label: "Fecha de nacimiento", name: "dateOfBirth" },
    ]],
    ["Doctor", [
      { label: "Paciente", name: "name", options: { justify: 'center' } },
      { label: "Edad", name: "age" },
      { label: "Sexo", name: "sex", options: { justify: 'end' } },
      { label: "Cuenta", name: "hasAccount" },
      { label: "Fecha de nacimiento", name: "dateOfBirth" },
    ]],
    ["Patient", [
      { label: "Paciente", name: "name", options: { justify: 'center' } },
      { label: "Edad", name: "age" },
      { label: "Sexo", name: "sex", options: { justify: 'end' } },
      { label: "Cuenta", name: "hasAccount" },
      { label: "Fecha de nacimiento", name: "dateOfBirth" },
    ]],
    ["Staff", [
      { label: "Asistente", name: "name", options: { justify: 'center' } },
      { label: "Edad", name: "age" },
      { label: "Sexo", name: "sex", options: { justify: 'end' } },
      { label: "Cuenta", name: "hasAccount" },
      { label: "Fecha de nacimiento", name: "dateOfBirth" },
    ]],
    ["Nurse", [
      { label: "Especialista", name: "name", options: { justify: 'center' } },
      { label: "Sexo", name: "sex", options: { justify: 'end' } },
      { label: "Puesto", name: "post" },
      { label: "Estudios", name: "education" },
      { label: "Fecha de incorporación", name: "createdAt" },
    ]],
  ]);
}
