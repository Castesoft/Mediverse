import { ParamMap } from "@angular/router";
import { SelectOption } from "src/app/_models/base/selectOption";
import { EntityParams } from 'src/app/_models/base/entityParams';
import { Entity } from 'src/app/_models/base/entity';
import { DoctorResult } from 'src/app/_models/doctors/doctorResults/doctorResult';
import { SearchTabs } from 'src/app/_models/search/searchTypes';


export class Search extends EntityParams<Entity> {
  specialty: SelectOption | null = null;
  location: SelectOption | null = null;
  result: DoctorResult = new DoctorResult();
  tab: SearchTabs | null | string = 'general';
  dayNumber: number | null = null;
  scheduleOption: number | null = null;
  eventId: number | null = null;

  constructor(key: string | null, init?: Partial<Omit<Search, 'setFromQueryParamMap' | 'paramsValue'>>) {
    super(key);
    Object.assign(this, init);
    Object.setPrototypeOf(this, Search.prototype);
  }

  setFromQueryParamMap(params: ParamMap): this {
    if (params.has('specialty') && params.has('specialtyId')) {
      this.specialty = new SelectOption({
        id: +params.get('specialtyId')!,
        name: params.get('specialty')!,
        code: params.get('specialty')!
      });
    }

    if (params.has('location') && params.has('locationName')) this.location = new SelectOption({
      code: params.get('location')!,
      name: params.get('locationName')!
    });

    if (params.has('doctorId')) {
      this.result = new DoctorResult({ id: +params.get('doctorId')! });
      if (params.has('doctorName')) {
        this.result.fullName = params.get('doctorName')!;
      }
    }

    if (params.has('eventId')) this.eventId = +params.get('eventId')!;
    if (params.has('tab')) this.tab = params.get('tab')! as SearchTabs;
    if (params.has('pageSize')) this.pageSize = +params.get('pageSize')!;
    if (params.has('dayNumber')) this.dayNumber = +params.get('dayNumber')!;
    if (params.has('pageNumber')) this.pageNumber = +params.get('pageNumber')!;
    if (params.has('scheduleOption')) this.scheduleOption = +params.get('scheduleOption')!;

    return this;
  }
}
