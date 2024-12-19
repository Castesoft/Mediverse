import { inject, Type } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Entity } from 'src/app/_models/base/entity';
import { NamingSubject } from 'src/app/_models/base/namingSubject';
import { FormUse } from 'src/app/_models/forms/formTypes';

export default function titleDetailResolver<
  T extends Entity,
  K extends keyof T
>(
  serviceClass: Type<{
    dictionary: NamingSubject;
    getById: (id: number) => Observable<T>;
  }>,
  use: FormUse,
  key?: K
): ResolveFn<string> {
  return (route, state) => {
    const service = inject(serviceClass);

    switch (use) {
      case 'create':
        return `Crear ${service.dictionary.singularTitlecase}`;
      case 'edit':
        return service.getById(+route.paramMap.get('id')!).pipe(
          map(item => {
            const value = key ? item[key] : item.name;
            return `Editar ${service.dictionary.singularTitlecase} ${value}`;
          })
        );

      case 'detail':
        return service.getById(+route.paramMap.get('id')!).pipe(
          map(item => {
            const value = key ? item[key] : item.name;
            return `${service.dictionary.singularTitlecase} ${value}`;
          })
        );
    }

    return service.dictionary.title;

  };
}
