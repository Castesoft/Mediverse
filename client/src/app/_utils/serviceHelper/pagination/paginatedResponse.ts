import { HttpClient, HttpParams } from "@angular/common/http";
import { map } from "rxjs";
import { Entity } from "src/app/_models/base/entity";
import { Item } from "src/app/_utils/serviceHelper/pagination/item";
import { Pagination } from "src/app/_utils/serviceHelper/pagination/pagination";

/**
 * Represents a paginated response containing a list of entities and pagination information.
 *
 * @template T - The type of entities extending `Entity`.
 *
 * @property {T[]} result - The array of entities in the current page.
 * @property {Pagination} pagination - The pagination information.
 *
 * @constructor
 * @param {T[]} [result=[]] - The array of entities in the current page.
 * @param {Pagination} pagination - The pagination information.
 *
 * @method
 * @name ids
 * @description Retrieves an array of `Item` instances containing the IDs of the entities.
 * @returns {Item[]} An array of `Item` instances.
 */
export class PaginatedResponse<T extends Entity> {
  result: T[] = [];
  pagination: Pagination;

  constructor(result: T[] = [], pagination: Pagination) {
    this.result = result;
    this.pagination = pagination;
  }

  get ids(): Item[] {
    return this.result.map((x) => new Item(x.id!));
  }
}

/**
 * Retrieves a paginated response of entities from the specified URL.
 *
 * @template T - The type of entities extending `Entity`.
 * @param {string} url - The endpoint URL to fetch data from.
 * @param {HttpParams} params - The HTTP parameters for the request.
 * @param {HttpClient} http - The HTTP client used to make the request.
 * @returns {Observable<PaginatedResponse<T>>} An observable emitting the paginated response containing entities and pagination data.
 */
export function getPaginatedResponse<T extends Entity>(
  url: string,
  params: HttpParams,
  http: HttpClient
) {
  return http.get<T[]>(url, { observe: "response", params }).pipe(
    map(response => {
      const result: T[] = response.body!.map((item) => {
        return { ...item, isSelected: false };
      });
      return new PaginatedResponse<T>(result, JSON.parse(response.headers.get("Pagination")!));
    })
  );
}
