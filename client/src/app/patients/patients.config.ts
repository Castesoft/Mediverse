import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup2 } from "src/app/_forms/form2";
import { Column, EntityParams, IParams, NamingSubject } from "src/app/_models/types";
import { User } from "src/app/_models/user";
import { ServiceHelper } from "src/app/_services/serviceHelper";
import { buildHttpParams, omitKeys } from "src/app/_utils/util";

export class Patient extends User {
  constructor(init?: Partial<Patient>) {
    super();
    Object.assign(this, init);
  }
}

export class PatientParams extends EntityParams<Patient> implements IParams {

  constructor(key: string) {
    super(key);
  }

  get httpParams(): HttpParams {
    return buildHttpParams(omitKeys(this, ['key', 'httpParams', 'id']));
  }
}

@Injectable({
  providedIn: 'root'
})
export class PatientsService extends ServiceHelper<Patient, PatientParams, FormGroup2<PatientParams>> {
  constructor() {
    super(PatientParams,
      'patients',
      new NamingSubject(
        'masculine',
        'paciente',
        'pacientes',
        'Pacientes',
        'patients',
        ['home', 'patients']
      ),
      [
        new Column('id', 'ID'),
        new Column('username', 'Usuario'),
        new Column('fullName', 'Nombre'),
        new Column('email', 'Correo electrónico'),
        new Column('phoneNumber', 'Teléfono'),
        new Column('age', 'Edad'),
        new Column('sex', 'Sexo'),
        new Column('dateOfBirth', 'Fecha de nacimiento'),
        new Column('taxId', 'RFC'),
      ]
    )
  }
}
