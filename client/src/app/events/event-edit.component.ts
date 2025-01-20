import { Component, inject, model, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { createId } from "@paralleldrive/cuid2";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Subject } from "rxjs";
import { AddressesService } from "src/app/addresses/addresses.config";
import { InputControlComponent } from "src/app/_forms/input-control.component";
import { ClinicSummaryCardComponent } from "src/app/clinics/clinic-summary-card.component";
import { NurseSummaryCardComponent } from "src/app/nurses/nurse-summary-card.component";
import { PatientSummaryCardComponent } from "src/app/patients/patient-summary-card.component";
import { ServicesService } from "src/app/services/services.config";
import { UsersService } from "../users/users.config";
import { IconsService } from "src/app/_services/icons.service";
import { FormUse, Role, View } from "src/app/_models/types";
import { User } from "../_models/users/user";
import { Product } from "../_models/products/product";
import Event from "../_models/events/event";
import { ServiceCardCompactComponent } from "src/app/services/components/service-card-compact.component";
import { Service } from "../_models/services/service";
import { Address } from "../_models/addresses/address";

@Component({
  selector: 'div[eventEditView]',
  templateUrl: 'event-edit.component.html',
  styleUrls: ['event-edit.component.scss'],
  imports: [
    CommonModule,
    InputControlComponent,
    ReactiveFormsModule,
    ServiceCardCompactComponent,
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

  key = model.required<string | null>();
  use = model.required<FormUse>();
  item = model.required<Event | null>();
  view = model.required<View>();
  role = model.required<Role>();

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

    // if (this.item().service) {
    //   this.service = this.item().service;
    //   // this.servicesService.setSelected$(this.selectServiceKey, this.item().service!);
    // }

    // if (this.item().clinic) {
    //   this.address = this.item().clinic;
    //   // this.addressesService.setSelected$(this.selectClinicKey, this.item().clinic!);
    // }

    // if (this.item().nurses) {
    //   this.nurses = this.item().nurses;
    //   // this.usersService.setMultipleSelected$(this.selectNursesKey, this.item().nurses!);
    // }

    // if (this.item().patient) {
    //   this.patient = this.item().patient;
    //   // this.usersService.setSelected$(this.selectPatientKey, this.item().patient!);
    // }



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
    // const timeFrom = this.getClosestTimeOption(new Date(this.item().dateFrom!));
    // const timeTo = this.getClosestTimeOption(new Date(this.item().dateTo!));

    // this.formGroup.controls['timeFrom']?.setValue(timeFrom);
    // this.formGroup.controls['timeTo']?.setValue(timeTo);
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
    // this.usersService.selected$(this.selectPatientKey).pipe(takeUntil(this.ngUnsubscribe)).subscribe((patient) => {
    //   this.patient = patient;
    // });
  }

  private subscribeToSelectedService = () => {
    // this.servicesService.selected$(this.selectServiceKey).pipe(takeUntil(this.ngUnsubscribe)).subscribe((service) => {
    //   this.service = service;
    // });
  }

  private subscribeToSelectedNurses = () => {
    // this.usersService.multipleSelected$(this.selectNursesKey).pipe(takeUntil(this.ngUnsubscribe)).subscribe((nurses) => {
    //   this.nurses = nurses;
    // });
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
      'select',
      this.view(),
    )
  }

  showPatientSelectModal = () => {
    // this.usersService.showCatalogModal(
    //   new MouseEvent('click'),
    //   this.selectPatientKey,
    //   'select',
    //   'Patient'
    // )
  }

  showNursesSelectModal = () => {
    // this.usersService.showCatalogModal(
    //   new MouseEvent('click'),
    //   this.selectNursesKey,
    //   'select',
    //   'Nurse'
    // )
  }
}
