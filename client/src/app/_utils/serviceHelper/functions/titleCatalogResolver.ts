import { inject, Type } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NamingSubject } from 'src/app/_models/base/namingSubject';

export default function titleCatalogResolver(
  serviceClass: Type<{ dictionary: NamingSubject }>
): ResolveFn<string> {
  return (route, state) => {
    const service = inject(serviceClass);
    return `${service.dictionary.title} | Catálogo`;
  }
}
