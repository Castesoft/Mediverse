import { CommonModule } from '@angular/common';
import { Component, effect, HostBinding, inject, model, ModelSignal, OnInit, signal, WritableSignal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Forms2Module } from 'src/app/_forms2/forms-2.module';
import { AvailableDay } from 'src/app/_models/availableDay';
import { AvailableTime } from 'src/app/_models/availableTime';
import { DoctorScheduleForm } from 'src/app/_models/doctorSchedules/doctorScheduleForm';
import Event from 'src/app/_models/events/event';
import { BadRequest } from 'src/app/_models/forms/badRequest';
import { Search } from 'src/app/_models/search/search';
import { getSearchRouteQueryParams } from 'src/app/_models/search/searchUtils';
import { AccountService } from 'src/app/_services/account.service';
import { DevService } from 'src/app/_services/dev.service';
import { SearchService } from 'src/app/_services/search.service';
import { MaterialModule } from 'src/app/_shared/material.module';
import { SignInBasicFormComponent } from 'src/app/auth/components/sign-in-basic-form.component';
import { StepperIconComponent } from 'src/app/search/utils/stepper-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconsService } from 'src/app/_services/icons.service';
import { MobileQueryService } from 'src/app/_services/mobile-query.service';

@Component({
  selector: 'div[doctorScheduleWindow]',
  standalone: true,
  templateUrl: './doctor-schedule-window.component.html',
  styleUrl: './doctor-schedule-window.component.scss',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    SignInBasicFormComponent,
    CommonModule,
    StepperIconComponent,
    Forms2Module,
    RouterModule,
    FaIconComponent,
  ],
})
export class DoctorScheduleWindowComponent implements OnInit {
  private readonly router: Router = inject(Router);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  readonly accountService: AccountService = inject(AccountService);
  readonly service: SearchService = inject(SearchService);
  readonly icons: IconsService = inject(IconsService);
  readonly dev: DevService = inject(DevService);
  readonly query = inject(MobileQueryService);

  selectedSchedule: ModelSignal<AvailableDay | null> = model.required();
  selectedTime: ModelSignal<AvailableTime | null> = model.required();
  scheduleWindowOpen: ModelSignal<boolean> = model.required();

  event: WritableSignal<Event | null> = signal(null);
  eventId: WritableSignal<number | null> = signal(null);

  form: DoctorScheduleForm = new DoctorScheduleForm();
  isSubmitting: boolean = false;

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  class = '';

  constructor() {
    effect(() => {

      if (this.query.isMobile()) {
        this.class = 'mobile-view';
      } else if (!this.query.isMobile()) {
        this.class = 'desktop-view';
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
          .patchTime(this.selectedTime());
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
    }).then(() => {});
  }

  onSubmit() {
    this.form.submitted = true;
    this.isSubmitting = true;

    this.service.createEvent(this.form.payload).subscribe({
      next: (response: Event) => {
        console.log(response);
        this.isSubmitting = false;

        if (!this.service.selected()!.hasPatientInformationAccess) {
          this.accountService.updateCurrentUser();
        }

        this.form.controls.service.patchValue(null);
        this.form.controls.clinic.patchValue(null);
        this.form.controls.medicalInsuranceCompany.patchValue(null);
        this.form.controls.paymentMethodType.patchValue(null);

        this.router.navigate([], {
          queryParams: { eventId: null },
          queryParamsHandling: 'merge'
        }).then(() => {});

        this.event.set(response);
      },
      error: (error: BadRequest) => {
        console.error(error);
        this.isSubmitting = false;
        this.form.error = error;
      }
    });
  }
}
