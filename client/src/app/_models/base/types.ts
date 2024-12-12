import { HttpParams } from "@angular/common/http";

export type Units = "kg" | "días" | "ha" | "años";
export type CatalogMode = "view" | "select" | "multiselect" | "readonly";
export type View = 'page' | 'modal' | 'inline';
export type NumberRange = { min: number; max: number; };
export type DateSpan = { start: Date; end: Date; };
export type DetailActions = 'edit' | 'cancel' | 'delete' | 'create';

export function getPaginationHeaders(pageNumber: number, pageSize: number) {
  let params = new HttpParams();

  params = params.append('pageNumber', pageNumber);
  params = params.append('pageSize', pageSize);

  return params;
}
