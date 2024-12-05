import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, model, effect } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { BsModalService } from "ngx-bootstrap/modal";
import { take } from "rxjs";
import { FormNewModule } from "src/app/_forms/_new/forms-new.module";
import { ControlCheckComponent } from "src/app/_forms/control-check.component";
import { ControlSelectComponent } from "src/app/_forms/control-select.component";
import { AvailableDay } from "src/app/_models/availableDay";
import { DoctorScheduleForm } from "src/app/_models/doctorSchedules/doctorScheduleForm";
import { BadRequest } from "src/app/_models/forms/error";
import { Search } from "src/app/_models/search/search";
import { AccountService } from "src/app/_services/account.service";
import { EventsService } from "src/app/_services/events.service";
import { SearchService } from "src/app/_services/search.service";
import { MaterialModule } from "src/app/_shared/material.module";
import { AddPaymentMethodComponent } from "src/app/account/components/account-billing/add-payment-method/add-payment-method.component";
import { SignInBasicFormComponent } from "src/app/auth/components/sign-in-basic-form.component";
import { StepperIconComponent } from "src/app/search/utils/stepper-icon.component";

@Component({
  selector: 'div[doctorScheduleWindow]',
  standalone: true,
  imports: [MaterialModule, ControlSelectComponent, ReactiveFormsModule, SignInBasicFormComponent, ControlCheckComponent, CommonModule,
    FormNewModule, StepperIconComponent,
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

  selectedSchedule = model.required<AvailableDay | null>();
  isMobile = model.required<boolean>();

  form = new DoctorScheduleForm();

  constructor() {
    effect(() => {
      if (this.service.selected() && this.accountService.current() && this.selectedSchedule()) {

        this.form.patch(this.service.selected()!, this.selectedSchedule()!);
      }
    })
  }

  ngOnInit(): void {
    this.accountService.getBillingDetails();
  }

  onClickClose() {
    this.service.search.set(new Search({ ...this.service.search(), scheduleOption: null }));

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.service.search().params,
      queryParamsHandling: 'merge'
    });
  }

  onChangePaymentMethod(event: any) {
    if (event.target.value === 'new') {
      const paymentMethodsLength = this.accountService.billingDetails()!.userPaymentMethods.length;
      this.bsModalService.show(AddPaymentMethodComponent, {
        initialState: {
          title: 'Añadir método de pago',
        },
      });

      this.bsModalService.onHide.pipe(take(1)).subscribe({
        next: _ => {
          const paymentMethodsLengthAfter = this.accountService.billingDetails()!.userPaymentMethods.length;
          if (paymentMethodsLengthAfter > paymentMethodsLength) {
            const lastPaymentMethod = this.accountService.billingDetails()!.userPaymentMethods[paymentMethodsLengthAfter - 1];
            this.form.patchValue({
              stripePaymentMethodId: lastPaymentMethod.stripePaymentMethodId,
            })
          } else {
            this.form.patchValue({
              stripePaymentMethodId: '',
            });
          }
        }
      });
    }
  }

  onSubmit() {
    this.form.submitted = true;

    this.eventsService.createInSearch(this.form.payload).subscribe({
      next: response => {

        // if (!this.service.selected()!.hasPatientInformationAccess) {
        //   this.accountService.updateCurrentUser();
        // }

        // const selectedSchedule = this.selectedSchedule();

        // if (selectedSchedule) {
        //   this.router.navigate([], {
        //     relativeTo: this.route,
        //     queryParams: { day: selectedSchedule.dayNumber },
        //     queryParamsHandling: 'merge',
        //   });
        // }
      },
      error: (error: BadRequest) => {
        this.form.error = error;
      }
    });
  }
}
