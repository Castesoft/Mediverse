import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridDayPlugin from '@fullcalendar/timegrid';
import timeGridWeekPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg, EventDragStopArg, } from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import { Component, forwardRef, inject, model, ModelSignal, OnDestroy, OnInit, viewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, DateSelectArg, DatesSetArg, EventClickArg } from '@fullcalendar/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ControlsModule } from 'src/app/_forms/controls.module';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import TableInputSignals from 'src/app/_models/base/components/interfaces/tableInputSignals';
import { CatalogMode, View } from 'src/app/_models/base/types';
import { Event } from 'src/app/_models/events/event';
import { EventFiltersForm } from 'src/app/_models/events/eventFiltersForm';
import { EventParams } from 'src/app/_models/events/eventParams';
import { AccountService } from 'src/app/_services/account.service';
import { CatalogModule } from 'src/app/_shared/catalog.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { EventsTableComponent } from 'src/app/events/components/events-table.component';
import { EventsService } from 'src/app/events/events.config';
import { calcDateDiff } from 'src/app/_utils/util';

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
export class EventsCalendarComponent
  extends BaseTable<Event, EventParams, EventFiltersForm, EventsService>
  implements OnInit, OnDestroy, TableInputSignals<Event, EventParams>
{
  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();
  data: ModelSignal<Event[]> = model.required();

  accountService = inject(AccountService);

  constructor() {
    super(EventsService, Event);
  }

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
    locale: esLocale,
    eventOverlap: false,
  };

  eventsModel: any;
  fullcalendar = viewChild.required<FullCalendarComponent>('fullcalendar');

  ngOnInit(): void {
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

  handleViewChange = (event: any) => {
    console.log(event);
  }

  handleDateClick(arg: DateClickArg) {
    this.service.clickLink(new Event({
      allDay: arg.allDay,
      dateFrom: arg.date,
      dateTo: arg.date,
    }), this.key(), 'create', 'modal');
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
}
