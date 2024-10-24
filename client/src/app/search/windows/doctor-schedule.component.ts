import { Component, effect, inject, input, model, OnInit, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { AccountService } from 'src/app/_services/account.service';
import { EventsService } from 'src/app/_services/events.service';
import { MaterialModule } from 'src/app/_shared/material.module';
import { AddPaymentMethodComponent } from 'src/app/account/components/account-billing/add-payment-method/add-payment-method.component';
import { SignInBasicFormComponent } from 'src/app/auth/components/sign-in-basic-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';
import { DoctorScheduleForm } from 'src/app/_models/doctorSchedule';
import { SearchService } from 'src/app/_services/search.service';
import { CommonModule } from '@angular/common';
import { AvailableDay } from 'src/app/_models/availableDay';
import { FormNewModule } from 'src/app/_forms/_new/forms-new.module';
import { BadRequest } from 'src/app/_models/types';

@Component({
  selector: 'div[doctorScheduleWindow]',
  standalone: true,
  imports: [MaterialModule, ControlSelectComponent, ReactiveFormsModule, SignInBasicFormComponent, ControlCheckComponent, CommonModule,
    FormNewModule,
  ],
  templateUrl: './doctor-schedule.component.html',
})
export class DoctorScheduleComponent implements OnInit {
  private bsModalService = inject(BsModalService);
  private eventsService = inject(EventsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  accountService = inject(AccountService);
  service = inject(SearchService);

  onClose = output<boolean>();
  selectedSchedule = model.required<AvailableDay | null>();
  isMobile = input<boolean>();

  form = new DoctorScheduleForm();

  constructor() {
    effect(() => {
      console.log('DoctorScheduleComponent effect', this.selectedSchedule());


      if (this.service.selected() && this.accountService.current()) {
        this.form.patch(this.service.selected()!, this.selectedSchedule());
      }
    })
  }

  ngOnInit(): void {
    this.accountService.getBillingDetails();
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

    this.eventsService.create(this.form.value, 'Patient', 'inline', '').subscribe({
      next: () => {
        if (!this.service.selected()!.hasPatientInformationAccess) {
          this.accountService.updateCurrentUser();
        }

        const selectedSchedule = this.selectedSchedule();

        if (selectedSchedule) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { day: selectedSchedule.dayNumber },
            queryParamsHandling: 'merge',
          });
          this.onClose.emit(true);
        }
      },
      error: (error: BadRequest) => {
        this.form.error = error;
      }
    });
  }
}
