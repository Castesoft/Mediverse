import esLocale from '@fullcalendar/core/locales/es';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridDayPlugin from '@fullcalendar/timegrid';
import timeGridWeekPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { DateClickArg, EventDragStopArg } from '@fullcalendar/interaction';
import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  forwardRef,
  inject,
  model,
  ModelSignal,
  OnDestroy,
  OnInit,
  Signal,
  viewChild
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { Calendar, CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ControlsModule } from 'src/app/_forms/controls.module';
import BaseTable from 'src/app/_models/base/components/extensions/baseTable';
import { CatalogMode, View } from 'src/app/_models/base/types';
import Event from 'src/app/_models/events/event';
import { EventFiltersForm } from 'src/app/_models/events/eventFiltersForm';
import { EventParams } from 'src/app/_models/events/eventParams';
import { AccountService } from 'src/app/_services/account.service';
import { CatalogModule } from 'src/app/_shared/catalog.module';
import { TablesModule } from 'src/app/_shared/template/components/tables/tables.module';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { EventsService } from 'src/app/events/events.config';
import { calcDateDiff } from 'src/app/_utils/util';
import { FormUse } from "src/app/_models/forms/formTypes";
import { SiteSection } from 'src/app/_models/sections/sectionTypes';
import { EventMonthDayCell } from "src/app/_models/event-month-day-cell/eventMonthDayCell";
import { EventSummary } from "src/app/_models/events/eventSummary/eventSummary";

@Component({
  host: { class: 'pb-6' },
  selector: 'div[eventsCalendar]',
  templateUrl: './events-calendar.component.html',
  standalone: true,
  imports: [
    BsDropdownModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AlertModule,
    ControlsModule,
    TablesModule,
    CatalogModule,
    TemplateModule,
    FullCalendarModule,
    ButtonsModule,
    CommonModule,
  ],
  styles: [ `
    .current-event {
      border: 3px solid var(--bs-primary);
      box-shadow: 0 0 0 3px rgba(var(--bs-primary-rgb), 0.3);
      z-index: 1;
    }

    .circle-bullet {
      display: inline-block;
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      margin-bottom: 1px;
    }

    .timed-event-container {
      transition: all 0.2s;
    }

    .timed-event-container:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  ` ]
})
export class EventsCalendarComponent extends BaseTable<Event, EventParams, EventFiltersForm, EventsService>
  implements OnInit, OnDestroy {
  item: ModelSignal<Event | null> = model.required();
  view: ModelSignal<View> = model.required();
  key: ModelSignal<string | null> = model.required();
  isCompact: ModelSignal<boolean> = model.required();
  mode: ModelSignal<CatalogMode> = model.required();
  params: ModelSignal<EventParams> = model.required();
  data: ModelSignal<EventMonthDayCell[]> = model.required();

  filtersCollapsed = model.required<boolean>();
  accountService = inject(AccountService);

  private colorMap: Record<string, string> = {
    'bg-primary': '#0d6efd',
    'bg-info': '#0dcaf0',
    'bg-success': '#198754',
    'bg-warning': '#ffc107'
  };

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

  fullcalendar: Signal<FullCalendarComponent> = viewChild.required('fullcalendar');

  constructor() {
    super(EventsService, Event);

    effect(() => {
      const eventsArray = this.data()?.flatMap((dayCell: EventMonthDayCell) => {
        if (!dayCell.events) return [];

        const eventsToReturn = dayCell.events.map((evt: EventSummary) => {
          const isAllDay: boolean = evt.allDay;

          const dynamicClass: string = this.getBgColorClass(
            evt.patient?.firstName || '',
            evt.dateFrom,
            evt.dateTo
          );

          const mainColorClass: string = dynamicClass.split(' ')[0];
          const bulletColor: string = this.colorMap[mainColorClass] || '#0d6efd';

          let classNames: string[] = [];
          if (isAllDay) {
            classNames = [ dynamicClass ];
          } else {
            const strippedClass = dynamicClass.replace(/bg-\w+/, '');
            classNames = [ strippedClass.trim(), 'bg-transparent' ];
          }

          const startDate = new Date(evt.dateFrom as any);
          const endDate = new Date(evt.dateTo as any);

          return {
            id: evt.id,
            start: startDate,
            end: endDate,
            allDay: isAllDay,
            classNames,
            extendedProps: {
              bulletColor,
              patient: `${evt.patient?.firstName || ''} ${evt.patient?.lastName || ''}`,
            }
          };
        });

        if (dayCell.totalCount && eventsToReturn.length < dayCell.totalCount) {
          const date = new Date(dayCell.date as any);
          date.setDate(date.getDate() + 1);

          const placeholderEvent = {
            id: -1,
            start: date,
            end: date,
            classNames: [ 'bg-transparent' ],
            extendedProps: {
              isExtensionIndicator: true,
              additionalAmount: dayCell.totalCount - eventsToReturn.length,
            },
          };

          eventsToReturn.push(placeholderEvent as any);
        }

        return eventsToReturn;
      }) || [];

      this.calendarOptions.events = eventsArray as any;
    });
  }

  ngOnInit(): void {
    forwardRef(() => Calendar);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private getBgColorClass(name: string, dateFrom: Date | null, dateTo: Date | null): string {
    if (!dateFrom || !dateTo) {
      throw new Error('dateFrom/dateTo is required');
    }

    const colors = [ 'bg-primary', 'bg-info', 'bg-success', 'bg-warning' ];
    const asciiSum = [ ...name ].reduce((sum, char) => sum + char.charCodeAt(0), 0);
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

  handleDateClick(arg: DateClickArg) {
    this.service.clickLink(
      new Event({ allDay: arg.allDay, dateFrom: arg.date, dateTo: arg.date }),
      this.key(),
      FormUse.CREATE,
      'modal',
      SiteSection.HOME
    );
  }

  handleEventClick(arg: EventClickArg) {
    const eventToSend: Event | null = this.service.getByIdFromData(+arg.event.id);
    if (!eventToSend) throw new Error('Event not found');
    this.service.clickLink(eventToSend, this.key(), FormUse.DETAIL, 'modal');
  }

  handleEventDragStop(arg: EventDragStopArg) {
    console.log(arg);
  }

  private handleSelect(arg: DateSelectArg) {
    if (calcDateDiff(arg.start, arg.end) !== -1) {
      // e.g. open creation
    }
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

  updateEvents() {
    const nowDate = new Date();
    const yearMonth = nowDate.getUTCFullYear() + '-' + (nowDate.getUTCMonth() + 1);
    this.calendarOptions.events = [
      {
        title: 'Updated Event',
        start: yearMonth + '-08',
        end: yearMonth + '-10',
      },
    ];
  }
}
