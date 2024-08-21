import {Component, inject, input, OnInit} from "@angular/core";
import {FormUse, Role, View} from "../_models/types";
import {Event} from "../_models/event";
import {CurrencyPipe, DatePipe, JsonPipe} from "@angular/common";
import {InputControlComponent} from "../_forms/input-control.component";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ServiceCardCompactComponent} from "../services/components/service-card-compact.component";
import {ServicesService} from "../_services/services.service";
import {createId} from "@paralleldrive/cuid2";
import {Service} from "../_models/service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {IconsService} from "../_services/icons.service";
import {ClinicSummaryCardComponent} from "../clinics/clinic-summary-card.component";
import {NurseSummaryCardComponent} from "../nurses/nurse-summary-card.component";
import {UsersService} from "../_services/users.service";
import {User} from "../_models/user";
import {Subject, takeUntil} from "rxjs";
import {PatientSummaryCardComponent} from "../patients/patient-summary-card.component";
import {Product} from "../_models/product";
import { Address, AddressesService } from "src/app/addresses/addresses.config";

@Component({
  selector: 'div[eventEditView]',
  templateUrl: 'event-edit.component.html',
  styleUrls: ['event-edit.component.scss'],
  imports: [
    DatePipe,
    JsonPipe,
    InputControlComponent,
    ReactiveFormsModule,
    ServiceCardCompactComponent,
    CurrencyPipe,
    FaIconComponent,
    ClinicSummaryCardComponent,
    NurseSummaryCardComponent,
    PatientSummaryCardComponent
  ],
  standalone: true,
})
export class EventEditComponent implements OnInit {
  private servicesService = inject(ServicesService);
  private addressesService = inject(AddressesService);
  private ngUnsubscribe = new Subject<void>();
  private usersService = inject(UsersService);
  icons = inject(IconsService);

  key = input.required<string | undefined>();
  use = input.required<FormUse>();
  item = input.required<Event>();
  id = input.required<number>();
  view = input.required<View>();
  role = input.required<Role>();

  formGroup: FormGroup = new FormGroup({});
  timeOptions: string[] = [];

  service?: Service;
  selectServiceKey = createId();

  address?: Address;
  selectClinicKey = createId();

  nurses?: User[];
  selectNursesKey = createId();

  patient?: User;
  selectPatientKey = createId();

  products?: Product[];

  ngOnInit(): void {
    this.initForm();
    this.generateTimeOptions();

    if (this.item().service) {
      this.service = this.item().service;
      this.servicesService.setSelected$(this.selectServiceKey, this.item().service!);
    }

    if (this.item().clinic) {
      this.address = this.item().clinic;
      // this.addressesService.setSelected$(this.selectClinicKey, this.item().clinic!);
    }

    if (this.item().nurses) {
      this.nurses = this.item().nurses;
      this.usersService.setMultipleSelected$(this.selectNursesKey, this.item().nurses!);
    }

    if (this.item().patient) {
      this.patient = this.item().patient;
      this.usersService.setSelected$(this.selectPatientKey, this.item().patient!);
    }



    this.subscribeToSelectedClinic();
    this.subscribeToSelectedService();
    this.subscribeToSelectedNurses();
    this.subscribeToSelectedPatient();

    this.setTimeOptions();
  }

  private initForm = () => {
    this.formGroup = new FormGroup({
      timeFrom: new FormControl(''),
      timeTo: new FormControl(''),
      date: new FormControl(''),
    });
  }

  private setTimeOptions = () => {
    const timeFrom = this.getClosestTimeOption(new Date(this.item().dateFrom));
    const timeTo = this.getClosestTimeOption(new Date(this.item().dateTo));

    this.formGroup.controls['timeFrom']?.setValue(timeFrom);
    this.formGroup.controls['timeTo']?.setValue(timeTo);
  }

  private getClosestTimeOption(date: Date): string {
    const target = date.getHours() * 60 + date.getMinutes();
    const value = this.timeOptions.reduce((prev, curr) => {
      const [prevHour, prevMinute] = prev.split(':').map(Number);
      const [currHour, currMinute] = curr.split(':').map(Number);
      const prevTotal = prevHour * 60 + prevMinute;
      const currTotal = currHour * 60 + currMinute;
      return Math.abs(currTotal - target) < Math.abs(prevTotal - target) ? curr : prev;
    });
    console.log(value);
    return value;
  }

  private generateTimeOptions() {
    const times = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 15) {
        const hour = i.toString().padStart(2, '0');
        const minute = j.toString().padStart(2, '0');
        times.push(`${hour}:${minute}`);
      }
    }
    this.timeOptions = times;
  }

  private subscribeToSelectedPatient = () => {
    this.usersService.selected$(this.selectPatientKey).pipe(takeUntil(this.ngUnsubscribe)).subscribe((patient) => {
      this.patient = patient;
    });
  }

  private subscribeToSelectedService = () => {
    this.servicesService.selected$(this.selectServiceKey).pipe(takeUntil(this.ngUnsubscribe)).subscribe((service) => {
      this.service = service;
    });
  }

  private subscribeToSelectedNurses = () => {
    this.usersService.multipleSelected$(this.selectNursesKey).pipe(takeUntil(this.ngUnsubscribe)).subscribe((nurses) => {
      this.nurses = nurses;
    });
  }

  private subscribeToSelectedClinic = () => {
    // this.addressesService.selected$(this.selectClinicKey).pipe(takeUntil(this.ngUnsubscribe)).subscribe((clinic) => {
    //   this.address = clinic;
    // });
  }

  showServiceSelectModal = () => {
    this.servicesService.showCatalogModal(
      new MouseEvent('click'),
      this.selectServiceKey,
      'select'
    )
  }

  showPatientSelectModal = () => {
    this.usersService.showCatalogModal(
      new MouseEvent('click'),
      this.selectPatientKey,
      'select',
      'Patient'
    )
  }

  showNursesSelectModal = () => {
    this.usersService.showCatalogModal(
      new MouseEvent('click'),
      this.selectNursesKey,
      'select',
      'Nurse'
    )
  }
}
