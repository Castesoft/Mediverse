import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Medicine, MedicineParams } from 'src/app/_models/medicine';
import { PaginatedResult } from 'src/app/_models/pagination';
import { FilterForm } from 'src/app/_models/patient';
import { getPaginatedResult } from 'src/app/_utils/util';



@Injectable({
  providedIn: 'root'
})
export class MedicinesService {
  subjectSingular = 'prescripción';
  subjectRoute = 'prescripciones';
  subjectPlural = `${this.subjectSingular}s`;
  subjectSingularUpperCase = `${this.subjectSingular.charAt(0).toUpperCase()}${this.subjectSingular.slice(1)}`;
  subjectPluralUpperCase = `${this.subjectPlural.charAt(0).toUpperCase()}${this.subjectPlural.slice(1)}`;

  baseUrl = environment.apiUrl;
  cache = new Map<string, PaginatedResult<any[]>>();

  constructor(private http: HttpClient) { }

  // Paged List
  private pagedList = new BehaviorSubject<PaginatedResult<Medicine[]> | null>(null);
  pagedList$ = this.pagedList.asObservable();

  // All
  private all = new BehaviorSubject<Medicine[]>([]);
  all$ = this.all.asObservable();

  // Current
  private current = new BehaviorSubject<Medicine | null>(null);
  current$ = this.current.asObservable();

  // Params
  private params = new BehaviorSubject<MedicineParams>(new MedicineParams());
  params$ = this.params.asObservable();

  // Loading
  private loading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public loading$ = this.loading.asObservable();

  // Selected
  private selected = new BehaviorSubject<Medicine | null>(null);
  selected$ = this.selected.asObservable();

  // Multiple Selected
  private multipleSelected = new BehaviorSubject<Medicine[]>([]);
  multipleSelected$ = this.multipleSelected.asObservable();

  // Get Paged List
  getPagedList(param: MedicineParams): Observable<PaginatedResult<Medicine[]>> {
    this.loading.next(true);

    const key = Object.values(param).join('-');
    const response = this.cache.get(key);

    if (response) {
      this.pagedList.next(response);
      this.loading.next(false);
      return of(response);
    }

    let params = param.toHttpParams();

    return getPaginatedResult<Medicine[]>(`${this.baseUrl}medicines/`, params, this.http).pipe(
      tap(response => {
        this.cache.set(key, response);
        this.pagedList.next(response);
        this.loading.next(false);
      })
    );
  }

  setSelected(medicine: Medicine | null) {
    this.selected.next(medicine);
  }

  setMultipleSelected(medicines: Medicine[]) {
    console.log(medicines);
    this.multipleSelected.next(medicines);
  }

  loadMore() {
    const params = this.getParams();
    params.pageNumber = 1;
    params.pageSize = 50;
    this.setParams(params);
  }

  loadLess() {
    const params = this.getParams();
    params.pageSize = 10;
    this.setParams(params);
  }

  onReset(filterForm: FilterForm) {
    filterForm.patchValue(new MedicineParams());
    this.resetParams();
  }

  onPageChanged(event: any) {
    const params = this.getParams();
    if (params.pageNumber !== event) {
      params.pageNumber = event;
      this.setParams(params);
    }
  }

  getById(id: number): Observable<Medicine> {
    this.loading.next(true);

    const current = [...this.cache.values()]
      .reduce((arr: Medicine[], elem) => elem.result ? arr.concat(elem.result) : arr, [])
      .find((current: Medicine) => current.id === id);

    if (current) {
      this.current.next(current);
      this.loading.next(false);
      return of(current);
    }

    return this.http.get<Medicine>(`${this.baseUrl}medicines/${id}`).pipe(
      tap(race => {
        this.current.next(race);
        this.loading.next(false);
      })
    );
  }

  getAll(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.baseUrl + 'medicines/all').pipe(
      tap((medicines) => {
        this.all.next(medicines);
      }),
    );
  }

  getParams(): MedicineParams {
    return this.params.getValue();
  }

  setParams(params: Partial<MedicineParams>) {
    const current = this.params.getValue();
    current.updateFromPartial(params);
    this.params.next(current);
  }

  create(formData: FormData): Observable<Medicine> {
    return this.http.post<Medicine>(`${this.baseUrl}medicines`, formData).pipe(
      tap((response: Medicine) => {
        this.cache.clear();
        this.pagedList.next(null);
        this.getPagedList(this.getParams()).subscribe();
        this.current.next(response);
        this.all.next([...this.all.value, response]);
      })
    )
  }

  update(id: number, formData: FormData): Observable<Medicine> {
    return this.http.put<Medicine>(`${this.baseUrl}medicines/${id}`, formData).pipe(
      tap((response: Medicine) => {
        const cacheKeys = Array.from(this.cache.keys());
        for (const key of cacheKeys) {
          const cacheValue = this.cache.get(key)!;
          const index = cacheValue.result!.findIndex(s => s.id === response.id);
          if (index !== -1) {
            cacheValue.result![index] = response;
            this.cache.set(key, cacheValue);
            this.pagedList.next(cacheValue);
          }
        }
      })
    )
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}medicines/${id}`).pipe(
      tap(() => {
        this.cache.clear();
        this.pagedList.next(null);
        this.getPagedList(this.getParams()).subscribe();
        this.current.next(null);
        this.all.next(this.all.value.filter(s => s.id !== id));
      })
    )
  }

  deleteRange(ids: string) {
    return this.http.delete(this.baseUrl + 'medicines/range/' + ids).pipe(
      tap(() => {
        this.current.next(null);
        const idsArray = ids.split(',').map(id => parseInt(id));
        const remaining = this.all.value.filter(x => !idsArray.includes(x.id));
        this.all.next(remaining);
        const cacheKeys = Array.from(this.cache.keys());

        for (const key of cacheKeys) {
          const cacheValue = this.cache.get(key);
          if (cacheValue && cacheValue.result) {
            idsArray.forEach(id => {
              const index = cacheValue.result!.findIndex(animal => animal.id === id);
              if (index !== -1) {
                cacheValue.result!.splice(index, 1);
              }
            });
            this.cache.set(key, cacheValue);
            const currentParams = Object.values(this.params.value).join('-');
            if (key === currentParams) {
              this.pagedList.next(cacheValue);
            }
          }
        }
      })
    );
  }

  resetParams() {
    const newParams = new MedicineParams();
    this.params.next(newParams);
  }
}
