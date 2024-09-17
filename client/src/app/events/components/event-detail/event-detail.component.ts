import {Component, inject, input, model, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {TabDirective, TabsetComponent} from 'ngx-bootstrap/tabs';
import {Event} from 'src/app/_models/event';
import {CurrencyPipe, DatePipe, NgSwitch, NgSwitchCase} from "@angular/common";
import {BootstrapModule} from "src/app/_shared/bootstrap.module";
import {DashboardModule} from "src/app/home/dashboard/dashboard.module";
import {FormUse} from "src/app/_models/types";
import {IconsService} from "../../../_services/icons.service";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EventServicesSummaryComponent } from 'src/app/events/components/event-services-summary.component';
import { UserProfilePictureComponent } from '../../../users/components/user-profile-picture/user-profile-picture.component';
import { PaymentsTableComponent } from '../../../_shared/components/payments-table/payments-table.component';
import { BsModalService } from 'ngx-bootstrap/modal';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { QuillModule } from 'ngx-quill';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EventsService } from 'src/app/_services/events.service';
import { SnackbarService } from 'src/app/_services/snackbar.service';
import { PrescriptionFormComponent } from 'src/app/prescriptions/components/prescription-form/prescription-form.component';
import { LayoutModule } from 'src/app/_shared/layout.module';
import { PrescriptionsTableComponent } from 'src/app/prescriptions/components/prescriptions-catalog/prescriptions-table/prescriptions-table.component';

@Component({
  selector: 'div[eventDetailView]',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
  standalone: true,
  imports: [
    DatePipe, RouterModule, BootstrapModule, NgSwitch, NgSwitchCase, DashboardModule, CurrencyPipe, FontAwesomeModule,
    EventServicesSummaryComponent, UserProfilePictureComponent, PaymentsTableComponent, EventSummaryComponent, QuillModule, ReactiveFormsModule,
    PrescriptionFormComponent, LayoutModule, PrescriptionsTableComponent, UserProfilePictureComponent
  ]
})
export class EventDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private modalService = inject(BsModalService);
  private fb = inject(FormBuilder);
  private eventService = inject(EventsService);
  private snackbarService = inject(SnackbarService);
  icons = inject(IconsService);

  use = input.required<FormUse>();
  key = input.required<string>();
  view = input.required<string>();

  item = model.required<Event>();

  id!: number;

  tax?: number;
  total?: number;

  activeDetails: string = 'general';
  activeTab: string = 'evolution';
  summaryMode: boolean = true;
  isEvolutionEditing: boolean = false;
  isNextStepsEditing: boolean = false;

  form = this.fb.group({
    evolution: [''],
    nextSteps: [''],
  });

  @ViewChild('staticTabs', {static: false}) staticTabs!: TabsetComponent;

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get('id')!;

    if (this.item() && this.item()!.service) {
      this.tax = this.item()!.service!.price * 0.16;
      this.total = this.item()!.service!.price + this.tax;
    }

    if (this.item()!.evolution) {
      this.form.patchValue({evolution: this.item()!.evolution});
    }

    if (this.item()!.nextSteps) {
      this.form.patchValue({nextSteps: this.item()!.nextSteps});
    }

    const currentUrl = this.router.url;
    if (currentUrl.split('/').length === 4 && !isNaN(+currentUrl.split('/')[3])) {
      this.summaryMode = false;
    }
  }

  onSave(tab: string) {
    if (tab === 'evolution') {
      this.eventService.updateEvent(this.item()!.id, {evolution: this.form.value.evolution ?? undefined}).subscribe((res) => {
        this.snackbarService.success('Evolución actualizada correctamente');
      });
      this.isEvolutionEditing = false;
    } else if (tab === 'nextSteps') {
      this.eventService.updateEvent(this.item()!.id, {nextSteps: this.form.value.nextSteps ?? undefined}).subscribe((res) => {
        this.snackbarService.success('Próximos pasos actualizados correctamente');
      });
      this.isNextStepsEditing = false;
    }
  }

  onSelectDetails(tab: string): void {
    this.activeDetails = tab;
  }

  onSelectTab(tab: string): void {
    this.activeTab = tab;
  }

  goToEvent() {
    this.router.navigate(['/home/events', this.item().id]);
    this.modalService.hide();
  }

  onAddNurse() {
    // Implement the logic to add a new nurse to the event
    console.log('Add nurse clicked');
  }
}
