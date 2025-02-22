import { CommonModule } from "@angular/common";
import { Component, effect, inject, model, OnInit, signal } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { Forms2Module } from "src/app/_forms2/forms-2.module";
import { AvailableDay } from "src/app/_models/availableDay";
import { AvailableTime } from 'src/app/_models/availableTime';
import { DoctorScheduleForm } from "src/app/_models/doctorSchedules/doctorScheduleForm";
import Event from 'src/app/_models/events/event';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { Search } from 'src/app/_models/search/search';
import { getSearchRouteQueryParams } from 'src/app/_models/search/searchUtils';
import { AccountService } from "src/app/_services/account.service";
import { DevService } from 'src/app/_services/dev.service';
import { SearchService } from "src/app/_services/search.service";
import { MaterialModule } from "src/app/_shared/material.module";
import { SignInBasicFormComponent } from "src/app/auth/components/sign-in-basic-form.component";
import { EventsService } from "src/app/events/events.config";
import { StepperIconComponent } from "src/app/search/utils/stepper-icon.component";

@Component({
  selector: 'div[doctorScheduleWindow]',
  standalone: true,
  imports: [ MaterialModule, ReactiveFormsModule, SignInBasicFormComponent, CommonModule,
    StepperIconComponent, Forms2Module, RouterModule,
  ],
  templateUrl: './doctor-schedule-window.component.html',
  styleUrl: './doctor-schedule-window.component.scss'
})
export class DoctorScheduleWindowComponent implements OnInit {
  private bsModalService = inject(BsModalService);
  private eventsService = inject(EventsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  accountService = inject(AccountService);
  service = inject(SearchService);
  dev = inject(DevService);

  selectedSchedule = model.required<AvailableDay | null>();
  selectedTime = model.required<AvailableTime | null>();
  scheduleWindowOpen = model.required<boolean>();
  isMobile = model.required<boolean>();

  event = signal<Event | null>(null);
  eventId = signal<number | null>(null);

  form = new DoctorScheduleForm();

  constructor() {

    const eventId = this.route.snapshot.queryParams['eventId'];
    if (eventId) this.eventId.set(+eventId);

    effect(() => {

      console.log('selectedTime', this.selectedTime());

      if (this.eventId() !== null) {
        this.eventsService.getById(this.eventId()!).subscribe({
          next: response => {
            this.event.set(response);
          }
        })
      }


      if (this.accountService.current()) {

        this.form
          .setDoctorResult(this.service.selected())
          .patchDoctor()
          .patchClinics()
          .patchServices()
          .patchMedicalInsuranceCompanies()
          .patchPaymentMethods()
          .patchSchedule(this.selectedSchedule())
          .patchTime(this.selectedTime())
        ;

      } else {
        throw new Error('User not authenticated');
      }
    })
  }

  ngOnInit(): void {
    this.accountService.getBillingDetails();
  }

  onClickClose() {
    this.selectedTime.set(null);
    this.service.search.set(new Search(this.service.search().key, { ...this.service.search(), scheduleOption: null }));
    this.scheduleWindowOpen.set(false);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: getSearchRouteQueryParams(this.service.search()),
      queryParamsHandling: 'merge'
    });

  }

  onSubmit() {
    this.form.submitted = true;

    this.service.createEvent(this.form.payload).subscribe({
      next: response => {

        if (!this.service.selected()!.hasPatientInformationAccess) {
          this.accountService.updateCurrentUser();
        }

        this.form.controls.service.patchValue(null);
        this.form.controls.clinic.patchValue(null);
        this.form.controls.medicalInsuranceCompany.patchValue(null);
        this.form.controls.paymentMethodType.patchValue(null);

        this.event.set(response);
      },
      error: (error: BadRequest) => {
        this.form.error = error;
      }
    });
  }
}
