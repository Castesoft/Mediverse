import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { AccountService } from 'src/app/_services/account.service';
import { SelectOption } from 'src/app/_forms/form';
import { FormGroup2, FormInfo } from 'src/app/_forms/form2';
import { FormNewModule } from 'src/app/_forms/_new/forms-new.module';
import { OccupationsService } from 'src/app/occupations/occupations.config';
import { RelativeTypesService } from 'src/app/relativeTypes/relativeTypes.config';
import { ColorBlindnessesService } from 'src/app/colorBlindnesses/colorBlindnesses.config';
import { MaritalStatusesService } from 'src/app/maritalStatuses/maritalStatuses.config';
import { SubstancesService } from 'src/app/substances/substances.config';
import { DiseasesService } from 'src/app/diseases/diseases.config';

export class MedicalRecord {
  name = '';
  age = 0;
  sex = new SelectOption();
  birthPlace = '';
  birthDate: Date = new Date();
  occupation = new SelectOption();
  handDominance = new SelectOption();
  maritalStatus = new SelectOption();

  constructor(init?: Partial<MedicalRecord>) {
    Object.assign(this, init);
  }
}

const handDominanceOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'right', name: 'Diestro' }),
  new SelectOption({ id: 2, code: 'left', name: 'Zurdo' }),
  new SelectOption({ id: 3, code: 'ambidextrous', name: 'Ambidiestro' }),
];

const sexOptions: SelectOption[] = [
  new SelectOption({ id: 1, code: 'male', name: 'Masculino' }),
  new SelectOption({ id: 2, code: 'female', name: 'Femenino' }),
];

export const medicalRecord = new MedicalRecord({
  name: 'Ramiro Castellanos Barrón',
  age: 24,
  birthDate: new Date(2000, 4, 2),
  birthPlace: 'Mexico',
  sex: new SelectOption({ id: 1, code: 'male', name: 'Masculino' }),

});

@Component({
  selector: 'app-account-clinical-history',
  standalone: true,
  imports: [CommonModule, BootstrapModule, FormNewModule, ],
  templateUrl: './account-clinical-history.component.html',
})
export class AccountClinicalHistoryComponent implements OnInit {
  accountService = inject(AccountService);

  occupations = inject(OccupationsService);
  relativeTypes = inject(RelativeTypesService);
  colorBlindnesses = inject(ColorBlindnessesService);
  maritalStatuses = inject(MaritalStatusesService);
  substances = inject(SubstancesService);
  diseases = inject(DiseasesService);

  occupationOptions: SelectOption[] = [];
  relativeTypeOptions: SelectOption[] = [];
  colorBlindnessOptions: SelectOption[] = [];
  maritalStatusOptions: SelectOption[] = [];
  substanceOptions: SelectOption[] = [];
  diseaseOptions: SelectOption[] = [];

  info: FormInfo<MedicalRecord> = {
    age: { label: 'Edad', placeholder: 'Edad', type: 'number' },
    birthDate: { label: 'Fecha de nacimiento', type: 'date', placeholder: 'Fecha de nacimiento' },
    birthPlace: { label: 'Lugar de nacimiento', placeholder: 'Lugar de nacimiento', type: 'text' },
    name: { label: 'Nombre del paciente', placeholder: 'Nombre del paciente', type: 'text' },
    sex: { label: 'Sexo', type: 'select', showCodeSpan: false, selectOptions: sexOptions },
    occupation: { label: 'Ocupación', type: 'select', showCodeSpan: false, },
    handDominance: { label: 'Dominancia manual', type: 'select', showCodeSpan: false, selectOptions: handDominanceOptions },
    maritalStatus: { label: 'Estado civil', type: 'select', showCodeSpan: false, },
  };

  medicalRecord = medicalRecord;

  form = new FormGroup2<MedicalRecord>(MedicalRecord, this.medicalRecord, this.info, { orientation: 'inline', });

  constructor() {
    this.form.valueChanges.subscribe({
      next: value => {
        console.log(value);
        console.log(this.form);

      }
    });

    this.occupations.getOptions().subscribe();
    this.relativeTypes.getOptions().subscribe();
    this.colorBlindnesses.getOptions().subscribe();
    this.maritalStatuses.getOptions().subscribe();
    this.substances.getOptions().subscribe();
    this.diseases.getOptions().subscribe();

    effect(() => {
      this.occupationOptions = this.occupations.options();
      this.relativeTypeOptions = this.relativeTypes.options();
      this.colorBlindnessOptions = this.colorBlindnesses.options();
      this.maritalStatusOptions = this.maritalStatuses.options();
      this.substanceOptions = this.substances.options();
      this.diseaseOptions = this.diseases.options();

      this.form.controls.occupation.selectOptions = this.occupationOptions;
      this.form.controls.maritalStatus.selectOptions = this.maritalStatusOptions;
    });
  }

  ngOnInit(): void {

  }
}
