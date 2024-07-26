import { Component, computed, inject, input, model, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { ControlTypeaheadComponent } from "src/app/_forms/control-typeahead.component";
import { PopoverModule } from "ngx-bootstrap/popover";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ErrorsAlertComponent } from "src/app/_forms/helpers/errors-alert.component";
import { finalize, map, Observable, Subject, takeUntil } from "rxjs";
import { EventsService } from "src/app/_services/events.service";
import { IconsService } from "src/app/_services/icons.service";
import { Event, EventParams, EventSummary } from "src/app/_models/event";
import { TypeaheadComplexOption } from "src/app/_models/types";
import { createId } from "@paralleldrive/cuid2";
import { AlertModule } from "ngx-bootstrap/alert";
import { TypeaheadMatch } from "ngx-bootstrap/typeahead";
import { DatePipe, JsonPipe } from "@angular/common";
import { EventSelectDisplayCardComponent } from "src/app/events/event-select-display-card.component";

interface EventTypeaheadOptions extends TypeaheadComplexOption {
  data: EventSummary,
}

@Component({
  selector: '[eventSelectTypeahead]',
  templateUrl: './event-select-typeahead.component.html',
  styleUrls: ['./event-select-typeahead.component.scss'],
  imports: [
    ControlTypeaheadComponent,
    FaIconComponent,
    PopoverModule,
    ReactiveFormsModule,
    ErrorsAlertComponent,
    AlertModule,
    JsonPipe,
    DatePipe,
    EventSelectDisplayCardComponent
  ],
  standalone: true
})
export class EventSelectTypeaheadComponent implements OnInit, OnChanges {
  private ngUnsubscribe = new Subject<void>();
  service = inject(EventsService);
  icons = inject(IconsService);

  isEventSelected = computed(() => this.item() !== null);
  selectionErrors = input<string[]>([]);
  isDisabled = input.required<boolean>();
  item = model.required<Event | null>();
  popover = input<string | undefined>();
  sex = input<string | undefined>();
  key = input<string>(createId());
  label = input<string>();
  showCatalogButton = input<boolean>(true);

  submitted = false;
  loading = true;

  formGroup: FormGroup = new FormGroup({});

  eventSummaries$: Observable<EventTypeaheadOptions[]> = new Observable();
  events: EventSummary[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.loading = false;
    this.initForm();
    this.subscribeToSelectedEvent();
    this.subscribeToFormValueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["isDisabled"]) {
      this.setInputDisabled(this.isDisabled());
    }
  }

  private subscribeToSelectedEvent(): void {
    this.service.selected$(this.key()).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (event) => {
        this.item.set(event || null);
        this.setInputStatusAndValue();
      }
    });
  }

  private initForm = (): void => {
    this.formGroup = new FormGroup({ eventTypeahead: new FormControl("", Validators.required) });
    this.setInputDisabled(this.isDisabled());
  };

  private subscribeToSummaries = (formValue: any) => {
    const eventParams: EventParams = new EventParams(this.key());

    eventParams.search = formValue.eventTypeahead;

    this.eventSummaries$ = this.service.getSummaryByValue(this.key(), eventParams)
      .pipe(map((response: EventSummary[]) => {
        this.events = response;

        return response.map((event: EventSummary) => {
            return { name: event.patient?.fullName ?? '', value: event.id, data: event };
          }
        );
      }));
  };

  private setInputStatusAndValue = () => {
    if (this.isEventSelected()) {
      this.submitted = true;
      const newValue = this.item()?.dateFrom || "";
      const currentValue = this.formGroup.controls["eventTypeahead"].value;

      if (newValue !== currentValue) {
        this.formGroup.controls["eventTypeahead"].setValue(newValue);
        this.submitted = true;
      }
    } else {
      if (this.formGroup.controls["eventTypeahead"].value !== "") {
        this.formGroup.controls["eventTypeahead"].setValue("");
        this.submitted = false;
      }
    }
  };

  private subscribeToFormValueChanges = () => {
    this.formGroup.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (formValue) => {
        this.subscribeToSummaries(formValue);
      }
    });
  };

  private setInputDisabled = (isDisabled: boolean): void => {
    if (!this.formGroup.controls["eventTypeahead"]) return;

    if (isDisabled) {
      this.formGroup.controls["eventTypeahead"].disable();
    } else {
      this.formGroup.controls["eventTypeahead"].enable();
    }
  };

  openCatalogModal = () => {
    this.service.showCatalogModal(new MouseEvent('click'), this.key(), 'select')
  }

  onTypeaheadSelect = (data: TypeaheadMatch): void => {
    if (!data.item.value) return;

    this.loading = true;
    this.service.getById(data.item.value)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((event) => {
        this.service.setSelected$(this.key(), event);
      });
  };

  onTypeaheadLoading = (loading: boolean) => this.loading = loading;
}
