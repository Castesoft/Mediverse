import { Injectable } from "@angular/core";
import { FormGroup2 } from "src/app/_forms/form2";
import { Address } from "src/app/_models/address";
import { Column, EntityParams, IParams, NamingSubject } from "src/app/_models/types";
import { ServiceHelper } from "src/app/_services/serviceHelper";
import { buildHttpParams, omitKeys } from "src/app/_utils/util";

export class Clinic extends Address {
  constructor(init?: Partial<Clinic>) {
    super();
    Object.assign(this, init);
  }
}

export class ClinicParams extends EntityParams<Clinic> implements IParams {
  constructor(key: string) {
    super(key);
  }

  get httpParams() {
    return buildHttpParams(omitKeys(this, ['key', 'httpParams', 'id']));
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClinicsService extends ServiceHelper<Clinic, ClinicParams, FormGroup2<ClinicParams>> {
  constructor() {
    super(ClinicParams,
      'clinics',
      new NamingSubject(
        'feminine',
        'clínica',
        'clínicas',
        'Clínicas',
        'clinics',
        ['home', 'clinics']
      ),
      [
        new Column('id', 'ID'),
        new Column('name', 'Nombre'),
        new Column('street', 'Calle'),
        new Column('exteriorNumber', 'Número exterior'),
        new Column('interiorNumber', 'Número interior'),
        new Column('neighborhood', 'Colonia'),
        new Column('city', 'Ciudad'),
        new Column('state', 'Estado'),
        new Column('country', 'País'),
        new Column('zipcode', 'Código postal'),
      ]
    )
  }
}
