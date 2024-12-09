import { Type, inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { Observable } from "rxjs";


/**
 * Creates a resolver function that retrieves an item by its ID using the provided service class.
 *
 * @template T - The type of the item to be resolved.
 * @param {Type<{ getById: (id: number) => Observable<T>; }>} serviceClass - The service class that provides the `getById` method.
 * @returns {ResolveFn<T | null>} A resolver function that retrieves the item by its ID.
 */
export default function createItemResolver<T>(
  serviceClass: Type<{ getById: (id: number) => Observable<T>; }>
): ResolveFn<T | null> {
  return (route, state) => {
    const service = inject(serviceClass);
    const id = +route.paramMap.get('id')!;
    return service.getById(id);
  };
}
