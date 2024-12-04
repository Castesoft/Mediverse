import { Injectable } from "@angular/core";
import { ServiceHelper } from "src/app/_services/serviceHelper";
import { FormGroup2, FormInfo } from "src/app/_forms/form2";
import { Column, Entity, EntityParams, IParams, NamingSubject } from "src/app/_models/types";
import { HttpParams } from "@angular/common/http";
import { buildHttpParams, omitKeys } from "src/app/_utils/util";
import { SelectOption } from "src/app/_forms/form";

export class MedicalInsuranceCompany extends Entity {
  photoUrl: string | null = null;

  constructor(init?: Partial<MedicalInsuranceCompany>) {
    super();

    Object.assign(this, init);
  }
}

export class MedicalInsuranceCompanyParams extends EntityParams<MedicalInsuranceCompany> {
  constructor(key: string) {
    super(key);
  }
}

export const medicalInsuranceCompanyInfo: FormInfo<MedicalInsuranceCompany> = {
  id: { label: 'ID', type: 'number' },
  name: { label: 'Nombre', type: 'text' },
  photoUrl: { label: 'URL de la foto', type: 'text' },
} as FormInfo<MedicalInsuranceCompany>;

@Injectable({
  providedIn: 'root'
})
export class MedicalInsuranceCompaniesService extends ServiceHelper<MedicalInsuranceCompany, MedicalInsuranceCompanyParams, FormGroup2<MedicalInsuranceCompanyParams>> {
  constructor() {
    super(
      MedicalInsuranceCompanyParams,
      'medicalInsuranceCompanies',
      new NamingSubject(
        'feminine',
        'aseguradora',
        'aseguradoras',
        'Aseguradoras',
        'medicalInsuranceCompanies',
        ['admin', 'utils', 'medicalInsuranceCompanies']
      ),
      [
        new Column('id', 'ID'),
        new Column('name', 'Nombre'),
      ]
    );
  }
}
