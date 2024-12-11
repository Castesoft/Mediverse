import { Component, forwardRef, inject, input, model, OnDestroy, OnInit, viewChild, } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IconsService } from 'src/app/_services/icons.service';
import { Pagination } from 'src/app/_models/pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule, DatePipe, DecimalPipe, JsonPipe } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CatalogMode, Role, View } from 'src/app/_models/types';
import { Router, RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FilterForm } from 'src/app/_models/event';
import { EventParams } from "src/app/_models/events/eventParams";
import { Event } from "src/app/_models/events/event";
import { ControlsModule } from 'src/app/_forms/controls.module';
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";
import { CatalogModule } from 'src/app/_shared/catalog.module';
import { calcDateDiff } from 'src/app/_utils/util';
import { EventsFilterMenuComponent } from 'src/app/events/components/events-filter-menu.component';
import { EventsTableComponent } from 'src/app/events/components/events-table.component';
import { EventsService } from 'src/app/_services/events.service';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { Calendar, CalendarOptions, DateSelectArg, DatesSetArg, EventClickArg, } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridDayPlugin from '@fullcalendar/timegrid';
import timeGridWeekPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg, EventDragStopArg, } from '@fullcalendar/interaction';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { ButtonsModule } from "ngx-bootstrap/buttons";
import esLocale from '@fullcalendar/core/locales/es';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  host: { class: 'pb-6' },
  selector: 'div[eventsCalendar]',
  templateUrl: `./events-calendar.component.html`,
  standalone: true,
  imports: [
    BsDropdownModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    EventsTableComponent,
    AlertModule,
    ControlsModule,
    TablesModule,
    CatalogModule,
    TemplateModule,
    EventsFilterMenuComponent,
    TemplateModule,
    FullCalendarModule,
    ButtonsModule,
    CommonModule,
  ],
  styles: `
    .current-event {
      border: 3px solid var(--bs-primary);
      box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.3);
      z-index: 1;
    }
  `
})
export class EventsCalendarComponent implements OnInit, OnDestroy {
  accountService = inject(AccountService);
  router = inject(Router);
  service = inject(EventsService);
  icons = inject(IconsService);

  key = model.required<string>();
  mode = model.required<CatalogMode>();
  view = model.required<View>();
  role = model.required<Role>();

  calendarView = 'calendar';
  data?: Event[];
  params!: EventParams;
  pagination?: Pagination;
  form = new FilterForm();
  loading = true;
  private ngUnsubscribe = new Subject<void>();

  calendarOptions: CalendarOptions = {
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
    datesSet: this.handleDatesSet.bind(this),
    locale: esLocale,
    eventOverlap: false,
  };

  eventsModel: any;
  fullcalendar = viewChild.required<FullCalendarComponent>('fullcalendar');

  ngOnInit(): void {
    this.params = new EventParams(this.key());

    this.service.setParam$(this.key(), this.params);

    this.params.isCalendarView = true;

    this.service
      .param$(this.key())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
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
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getBgColorClass = (name: string, dateFrom: Date, dateTo: Date): string => {
    const colors = ['bg-primary', 'bg-info', 'bg-success', 'bg-warning'];
    const asciiSum = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const classIndex = asciiSum % colors.length;
    const baseColor = colors[classIndex];

    const now = new Date();
    if (dateFrom <= now && now <= dateTo) {
      return `${baseColor} border-2 border-primary`;
    } else if (dateTo < now) {
      return `${baseColor} opacity-50`;
    }
    return baseColor;
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
              patient: `${event.patient?.firstName} ${event.patient?.lastName || ''}`,
              doctor: `${event.doctor?.firstName} ${event.doctor?.lastName || ''}`,
              description: `${event.service?.name}`,
              start: event.dateFrom,
              end: event.dateTo,
              id: event.id,
              className: this.getBgColorClass(event.patient?.firstName || '', new Date(event.dateFrom!), new Date(event.dateTo!)),
            } as any;
          });
        }
      },
    });
  }

  handleViewChange = (event: any) => {
    console.log(event);
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

  handleDateClick(arg: DateClickArg) {
    // this.service.clickLink(
    //   null,
    //   null,
    //   this.key(),
    //   'create',
    //   'modal',
    //   arg.date,
    //   arg.date
    // );
  }

  formatTimeRange = (start: Date, end: Date): string => {
    if (!start || !end) {
      return '';
    }
    const startHours = start.getHours();
    const endHours = end.getHours();
    const startPeriod = startHours >= 12 ? 'PM' : 'AM';
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';

    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const startTimeFormatted = startTime.replace(/AM|PM/, '').trim();
    const endTimeFormatted = endTime.replace(/AM|PM/, '').trim();

    if (startPeriod === endPeriod) {
      return `${startTimeFormatted} - ${endTimeFormatted} ${endPeriod}`;
    } else {
      return `${startTimeFormatted} ${startPeriod} - ${endTimeFormatted} ${endPeriod}`;
    }
  }

  handleEventClick(arg: EventClickArg) {
    // this.service.clickLink(+arg.event.id, this.service.getById$(+arg.event.id, this.key(), this.role()), this.key(), 'detail', 'modal');
  }

  handleEventDragStop(arg: EventDragStopArg) {
    console.log(arg);
  }

  private handleSelect(arg: DateSelectArg) {
    if (calcDateDiff(arg.start, arg.end) !== -1) {
      // this.service.clickLink(
      //   null,
      //   null,
      //   this.key(),
      //   'create',
      //   'modal',
      //   arg.start,
      //   arg.end
      // );
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

  handleDatesSet(arg: DatesSetArg) {
    this.params.updateFromPartial({
      dateFrom: arg.start,
      dateTo: arg.end,
    });
    this.service.setParam$(this.key(), this.params);
  }

  protected readonly FormGroup = FormGroup;
}
