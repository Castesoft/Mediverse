import {
  Component,
  forwardRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IconsService } from 'src/app/_services/icons.service';
import { Pagination } from 'src/app/_models/pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, takeUntil } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CatalogMode, Role, View } from 'src/app/_models/types';
import { Router, RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FilterForm, Event, EventParams } from 'src/app/_models/event';
import { ControlsModule } from 'src/app/_forms/controls.module';
import { TableModule } from 'src/app/_shared/table/table.module';
import { CatalogModule } from 'src/app/_shared/catalog.module';
import { calcDateDiff } from 'src/app/_utils/util';
import { EventsFilterMenuComponent } from 'src/app/events/components/events-filter-menu.component';
import { EventsTableComponent } from 'src/app/events/components/events-table.component';
import { EventsService } from 'src/app/_services/events.service';
import { LayoutModule } from 'src/app/_shared/layout.module';
import {
  CalendarOptions,
  Calendar,
  EventClickArg,
  DateSelectArg,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridDayPlugin from '@fullcalendar/timegrid';
import timeGridWeekPlugin from '@fullcalendar/timegrid';
import interactionPlugin, {
  DateClickArg,
  EventDragStopArg,
} from '@fullcalendar/interaction';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  host: { class: 'pb-6' },
  selector: 'div[eventsCalendar]',
  template: `
    <div class="card-header">
      <h2 class="card-title fw-bold">Citas</h2>
      <div class="card-toolbar">
        <button
          createBtn
          (click)="service.clickLink(null, null, key(), 'create', 'modal')"
          [naming]="service.naming!"
        ></button>
      </div>
    </div>
    <div class="card-body">
      @if (calendarOptions) {
      <full-calendar #fullcalendar [options]="calendarOptions">
        <ng-template #eventContent let-arg>
          <b>{{ arg.event.title }}</b> - {{ arg.event.start.getDate() }}
        </ng-template>
      </full-calendar>
      }
    </div>
  `,
  standalone: true,
  imports: [
    BsDropdownModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DecimalPipe,
    EventsTableComponent,
    AlertModule,
    ControlsModule,
    TableModule,
    CatalogModule,
    LayoutModule,
    EventsFilterMenuComponent,
    LayoutModule,
    FullCalendarModule,
  ],
})
export class EventsCalendarComponent implements OnInit, OnDestroy {
  router = inject(Router);
  service = inject(EventsService);
  icons = inject(IconsService);

  key = input.required<string>();
  mode = input.required<CatalogMode>();
  view = input.required<View>();
  role = input.required<Role>();

  data?: Event[];
  params!: EventParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  ngOnInit(): void {
    this.params = new EventParams(this.key());

    this.service.setParam$(this.key(), this.params);

    this.service
      .param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        console.log(params);

        this.params = params;
        this.loadData(params);
        this.form.patchValue(params);
      });

    this.form.group.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(this.handleFormValueChange.bind(this));

    this.service
      .loading$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((loading) => (this.loading = loading));

    forwardRef(() => Calendar);

    this.calendarOptions = {
      plugins: [
        dayGridPlugin,
        interactionPlugin,
        timeGridDayPlugin,
        timeGridWeekPlugin,
      ],
      selectable: true,
      editable: true,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventDragStop: this.handleEventDragStop.bind(this),
      select: this.handleSelect.bind(this),
    };
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private loadData(params: EventParams) {
    this.service.loadPagedList(this.role(), this.key(), params).subscribe({
      next: (response) => {
        const { result, pagination } = response;
        this.data = result;
        this.pagination = pagination;
        if (this.calendarOptions && result) {
          this.calendarOptions.events = result!.map((event) => {
            return {
              title: `${event.patient?.firstName} ${event.service?.name}`,
              start: event.dateFrom,
              end: event.dateTo,
              id: event.id,
            } as any;
          });
        }
      },
    });
  }

  private handleFormValueChange = () => {
    const { controls, value } = this.form.group;
    const { dateRange } = controls;

    this.params.updateFromPartial({
      ...value,
      dateFrom: dateRange.value[0],
      dateTo: dateRange.value[1],
    });
  };

  onSubmit() {
    this.service.setParam$(this.key(), this.params);
    this.form.patchValue(this.params);
  }

  calendarOptions?: CalendarOptions;
  eventsModel: any;
  fullcalendar = viewChild.required<FullCalendarComponent>('fullcalendar');

  handleDateClick(arg: DateClickArg) {
    this.service.clickLink(
      null,
      null,
      this.key(),
      'create',
      'modal',
      arg.date,
      arg.date
    );
  }

  handleEventClick(arg: EventClickArg) {
    this.service.clickLink(+arg.event.id, this.service.getById$(+arg.event.id, this.key(), this.role()), this.key(), 'detail', 'modal');
  }

  handleEventDragStop(arg: EventDragStopArg) {
    console.log(arg);
  }

  private handleSelect(arg: DateSelectArg) {
    if (calcDateDiff(arg.start, arg.end) !== -1) {
      this.service.clickLink(
        null,
        null,
        this.key(),
        'create',
        'modal',
        arg.start,
        arg.end
      );
    }
  }

  updateEvents() {
    const nowDate = new Date();
    const yearMonth =
      nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);

    this.calendarOptions!.events = [
      {
        title: 'Updated Event',
        start: yearMonth + '-08',
        end: yearMonth + '-10',
      },
    ];
  }
}
