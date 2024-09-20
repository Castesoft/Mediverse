import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs';
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';
import { AccountService } from 'src/app/_services/account.service';
import { EventsService } from 'src/app/_services/events.service';
import { MaterialModule } from 'src/app/_shared/material.module';
import { AddPaymentMethodComponent } from 'src/app/account/components/account-billing/add-payment-method/add-payment-method.component';
import { SignInBasicFormComponent } from 'src/app/auth/components/sign-in-basic-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ControlCheckComponent } from 'src/app/_forms/control-check.component';

@Component({
  selector: 'app-doctor-schedule',
  standalone: true,
  imports: [MaterialModule, ControlSelectComponent, ReactiveFormsModule, SignInBasicFormComponent, ControlCheckComponent],
  templateUrl: './doctor-schedule.component.html',
  styleUrl: './doctor-schedule.component.scss'
})
export class DoctorScheduleComponent implements OnInit {
  private bsModalService = inject(BsModalService);
  private fb = inject(FormBuilder);
  private eventsService = inject(EventsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  accountService = inject(AccountService);

  onClose = output<boolean>();
  selectedSchedule = input<any>();
  doctor = input<DoctorSearchResult>();
  submitted = false;

  form = this.fb.group({
    doctorId: [0, Validators.min(1)],
    patientId: [0, Validators.min(1)],
    dateFrom: ['', Validators.required],
    dateTo: ['', Validators.required],
    timeFrom: ['', Validators.required],
    timeTo: ['', Validators.required],
    clinicId: [0, Validators.min(1)],
    serviceId: [0, Validators.min(1)],
    medicalInsuranceCompanyId: [0],
    paymentMethodTypeId: [0, Validators.min(1)],
    stripePaymentMethodId: [''],
    hasPatientInformationAccess: [false, Validators.requiredTrue],
  });

  constructor() {
    effect(() => {
      if (this.doctor() && this.accountService.current()) {
        this.form.patchValue({
          doctorId: this.doctor()!.id,
          patientId: this.accountService.current()!.id,
        });

        if (this.selectedSchedule()) {
          this.form.patchValue({
            dateFrom: new Date(this.selectedSchedule().day.year, this.selectedSchedule().day.monthNumber - 1, this.selectedSchedule().day.dayNumber).toISOString(),
            dateTo: new Date(this.selectedSchedule().day.year, this.selectedSchedule().day.monthNumber - 1, this.selectedSchedule().day.dayNumber).toISOString(),
            timeFrom: this.selectedSchedule().time.start,
            timeTo: this.selectedSchedule().time.end,
          });
        }

        if (this.doctor()!.addresses.length === 1) {
          this.form.patchValue({
            clinicId: this.doctor()!.addresses[0].id,
          });
        }

        if (this.doctor()!.services.length === 1) {
          this.form.patchValue({
            serviceId: this.doctor()!.services[0].id,
          });
        }

        if (this.doctor()!.medicalInsuranceCompanies.length === 1) {
          this.form.patchValue({
            medicalInsuranceCompanyId: this.doctor()!.medicalInsuranceCompanies[0].id,
          });
        }

        if (this.doctor()!.paymentMethods.length === 1) {
          this.form.patchValue({
            paymentMethodTypeId: this.doctor()!.paymentMethods[0].id,
          });
        }

        if (this.doctor()!.hasPatientInformationAccess) {
          this.form.patchValue({
            hasPatientInformationAccess: true,
          });
        }
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
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.eventsService.create(this.form.value, 'Patient', 'inline', '').subscribe({
      next: () => {
        if (!this.doctor()!.hasPatientInformationAccess) {
          this.accountService.updateCurrentUser();
        }

        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { day: this.selectedSchedule()?.day.dayNumber },
          queryParamsHandling: 'merge',
        });
        this.onClose.emit(true);
      },
      error: () => {
        this.onClose.emit(false);
      }
    });
  }
}
