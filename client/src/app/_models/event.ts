import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";
import { User } from "./users/user";

export class Event extends Entity {
  allDay = false;
  dateFrom: Date | null = null;
  dateTo: Date | null = null;
  paymentStatus: SelectOption | null = null;
  paymentMethodType: SelectOption | null = null;
  medicalInsuranceCompany: SelectOption | null = null;
  evolution: string | null = null;
  nextSteps: string | null = null;

  patient: User = new User();
  doctor: User = new User();
  service: Service = new Service();
  clinic: Address = new Address();
  nurses: User[] = [];
  payments: Payment[] = [];
  prescriptions: Prescription[] = [];

  select: SelectOption | null = null;

  constructor(init?: Partial<Event>) {
    super();
    Object.assign(this, init);
  }
}

export const eventInfo: FormInfo<Event> = {
  // ...baseInfo,
  // allDay: { label: 'Todo el día', type: 'checkbox', },
  // dateFrom: { label: 'Fecha de inicio', type: 'date', },
  // dateTo: { label: 'Fecha de fin', type: 'date', },
  // evolution: { label: 'Evolución', type: 'textarea', },
  // nextSteps: { label: 'Próximos pasos', type: 'textarea', },

  // doctor: userInfo,
  // patient: userInfo,
  // service: serviceInfo,
  // clinic: addressInfo,
  // nurses: userInfo,
  // medicalInsuranceCompany: { label: 'Compañía de seguro médico', type: 'typeahead', },
  // paymentMethodType: { label: 'Método de pago', type: 'typeahead', },
  // payments: paymentInfo,
  // paymentStatus: { label: 'Estado de pago', type: 'typeahead', },
  // prescriptions: prescriptionInfo,
} as FormInfo<Event>;

export class EventForm extends FormGroup2<Event> {
  constructor() {
    super(Event, new Event(), eventInfo);
  }

  payload(): any {
    return this.value;
  }
}

export class EventParams {
  pageNumber = 1;
  pageSize = 10;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sort = 'createdAt';
  isSortAscending = false;
  isCalendarView = false;
  role?: Role;
  key?: string;

  // other
  sex?: string;

  constructor(key: string) {
    this.key = key;
  }

  toHttpParams(): HttpParams {
    let params = getPaginationHeaders(this.pageNumber, this.pageSize);

    if (this.key) params = params.append('id', this.key);
    if (this.search) params = params.append('search', this.search);
    if (this.role) params = params.append('role', this.role);
    if (this.dateFrom)
      params = params.append(
        'dateFrom',
        this.dateFrom.toISOString(),
      );
    if (this.dateTo)
      params = params.append(
        'dateTo',
        this.dateTo.toISOString(),
      );
    if (this.sort) params = params.append('sort', this.sort);
    if (this.isSortAscending)
      params = params.append('isSortAscending', this.isSortAscending);
    if (this.pageSize) {
      params = params.append('pageSize', this.pageSize.toString());
    }
    if (this.isCalendarView) params = params.append('isCalendarView', this.isCalendarView);

    if (this.sex) params = params.append('sex', this.sex);

    return params;
  }

  updateFromPartial(partial: Partial<EventParams>) {
    Object.assign(this, partial);
  }

  setFromFormGroup(group: FormGroup) {
    this.pageSize = group.controls['pageSize'].value;
    this.search = group.controls['search'].value;
  }

  update(group: FormGroup, service: EventsService, key: string) {
    this.setFromFormGroup(group);
    service.setParam$(key, this);
  }
}

export class FilterForm {
  group: FormGroup;
  id: string;

  constructor() {
    this.id = `$citafilterForm${createId()}`;
    this.group = new FormGroup({
      search: new FormControl(''),
      dateRange: new FormControl({ value: ['', ''], disabled: false }),
      pageSize: new FormControl(10, [
        Validators.required,
        Validators.min(1),
        Validators.max(50),
      ]),
      sex: new FormControl(''),
    });
  }

  patchValue(params: EventParams) {
    const dateRange = [params.dateFrom, params.dateTo];

    this.group.patchValue(
      {
        search: params.search,
        dateRange,
        pageSize: params.pageSize ?? 10,
        sex: params.sex
      },
      { emitEvent: false, onlySelf: true },
    );
  }
}

export class EventDoctorFields {
  addresses!: Address[];
}
