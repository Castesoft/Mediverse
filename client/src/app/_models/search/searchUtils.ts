import { HttpParams } from '@angular/common/http';
import { Params } from '@angular/router';
import { Search } from 'src/app/_models/search/search';

export function getSearchHttpParams(search: Search): HttpParams {
  let params: HttpParams = new HttpParams();

  if (search.specialty?.id) params = params.append('specialtyId', search.specialty.id.toString());
  if (search.specialty?.name) params = params.append('specialty', search.specialty.name);
  if (search.location?.code) params = params.append('location', search.location.code);
  if (search.location?.name) params = params.append('locationName', search.location.name);
  if (search.pageNumber) params = params.append('pageNumber', search.pageNumber.toString());
  if (search.pageSize) params = params.append('pageSize', search.pageSize.toString());

  return params;
}

export function getSearchRouteQueryParams(search: Search): Params {
  const params: Params = {};

  if (search.specialty?.id) params['specialtyId'] = search.specialty.id.toString();
  else params['specialtyId'] = null;

  if (search.specialty?.name) params['specialty'] = search.specialty.name;
  else params['specialty'] = null;

  if (search.location?.code) params['location'] = search.location.code;
  else params['location'] = null;

  if (search.location?.name) params['locationName'] = search.location.name;
  else params['locationName'] = null;

  if (search.result.id) params['doctorId'] = search.result.id.toString();
  else params['doctorId'] = null;

  if (search.result.fullName) params['doctorName'] = search.result.fullName;
  else params['doctorName'] = null;

  if (search.pageNumber) params['pageNumber'] = search.pageNumber.toString();
  else params['pageNumber'] = null;

  if (search.pageSize) params['pageSize'] = search.pageSize.toString();
  else params['pageSize'] = null;

  if (search.tab) params['tab'] = search.tab;
  else params['tab'] = null;

  if (search.dayNumber !== null) params['dayNumber'] = search.dayNumber;
  else params['dayNumber'] = null;

  if (search.scheduleOption !== null) params['scheduleOption'] = search.scheduleOption;
  else params['scheduleOption'] = null;

  if (search.eventId !== null) params['eventId'] = search.eventId;
  else params['eventId'] = null;

  return params;
}
