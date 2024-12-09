import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Pagination } from "src/app/_utils/serviceHelper/pagination/pagination";

/**
 * Represents a paginated result containing data and pagination information.
 *
 * @template T - The type of the result data.
 */
export class PaginatedResult<T> {
  result?: T;
  pagination: Pagination | null = null;
}

/**
 * Retrieves a paginated result from the specified URL using given HTTP parameters and client.
 *
 * @template T The type of the expected result.
 * @param {string} url The endpoint URL to send the GET request to.
 * @param {HttpParams} params The HTTP parameters to include in the request.
 * @param {HttpClient} http The HTTP client used to perform the request.
 * @returns An observable emitting a `PaginatedResult` containing the data and pagination info.
 */
export function getPaginatedResult<T>(
  url: string,
  params: HttpParams,
  http: HttpClient
): Observable<PaginatedResult<T>> {
  const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>();
  return http.get<T>(url, { observe: "response", params }).pipe(
    map((response) => {
      if (response.body) {
        paginatedResult.result = response.body;
      }
      const pagination = response.headers.get("Pagination");
      if (pagination) {
        paginatedResult.pagination = JSON.parse(pagination);
      }
      return paginatedResult;
    })
  );
}
