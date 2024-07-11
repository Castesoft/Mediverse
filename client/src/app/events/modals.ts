import {AfterContentChecked, AfterRenderPhase, Component, inject, OnInit, viewChild} from "@angular/core";
import {DateClickArg} from "@fullcalendar/interaction";
import { CatalogMode, FormUse, Role, View } from "src/app/_models/types";
import { Event } from "src/app/_models/event";
import { EventsService } from "src/app/_services/events.service";
import {LayoutModule} from "src/app/_shared/layout.module";
import { ModalWrapperModule } from "src/app/_shared/modal-wrapper.module";
import {EventFormComponent} from "src/app/events/components/event-form.component";
import { EventsCatalogComponent } from "src/app/events/components/events-catalog.component";
import { EventsFilterFormComponent } from "src/app/events/components/events-filter-form.component";
import { EventDetailComponent, EventEditComponent, EventNewComponent } from "src/app/events/views";

@Component({
  selector: 'event-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          eventEditView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="undefined"
          [item]="item"
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [EventEditComponent, ModalWrapperModule],
})
export class EventEditModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  item!: Event;
}

@Component({
  selector: 'event-edit-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody>
        <div
          eventDetailView
          [id]="id"
          [use]="use"
          [view]="'modal'"
          [key]="key"
          [item]="item"
        ></div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [EventDetailComponent, ModalWrapperModule],
})
export class EventDetailModalComponent {
  id!: number;
  use!: FormUse;
  title?: string;
  key!: string;
  item!: Event;
}

@Component({
  selector: 'event-new-modal',
  template: `
    <div modalContent>
      <div formWrapper>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody [type]="'thin'">
          <div eventForm [use]="use" [view]="'modal'" [id]="null" (formId)="formId = $event; receiveFormId($event);"
               [dateFrom]="dateFrom" [dateTo]="dateTo"
          ></div>
        </div>
        <div modalFooter class="flex-center">
          <button resetBtn (click)="service.hideNewModal()">Cancel</button>
          @if(formId){<button submitBtn [attr.form]="this.formId"></button>}
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [ModalWrapperModule, LayoutModule, EventFormComponent,],
})
export class EventNewModalComponent implements OnInit{
  formId?: string;
  use!: FormUse;
  title?: string;
  service = inject(EventsService);
  dateFrom?: Date;
  dateTo?: Date;

  form = viewChild.required(EventFormComponent);

  receiveFormId(event: any) {
    this.formId = event;
  }

  ngOnInit(): void {
  }
}

@Component({
  selector: 'events-filter-modal',
  template: `
    <div modalContent>
      @if (title) {
        <div modalHeader [title]="title"></div>
      }
      <div modalBody [type]="'form'">
        <div filterForm [key]="key" [formId]="formId" ></div>
      </div>
      <div
        modalFooterFilters
        [formId]="formId"
        (onReset)="onReset()"
        (onSubmit)="onSubmit()"
      ></div>
    </div>
  `,
  standalone: true,
  imports: [EventsFilterFormComponent, ModalWrapperModule],
})
export class EventsFilterModalComponent implements OnInit {
  service = inject(EventsService);

  formId!: string;
  key!: string;
  title?: string;

  form = viewChild.required(EventsFilterFormComponent);

  onReset = () =>
    this.form()!.service.resetForm(this.key, this.form()!.form);
  onSubmit = () => this.form()!.onSubmit();

  ngOnInit(): void {
    this.formId = this.form().form.id;
  }
}

@Component({
  selector: 'events-catalog-modal',
  template: `
    @defer {
      <div modalContent>
        @if (title) {
          <div modalHeader [title]="title"></div>
        }
        <div modalBody>
          <div
            eventsCatalog
            class="modal-body py-3 px-4"
            [mode]="mode"
            [isCompact]="isCompact"
            [key]="key"
            [view]="view"
          ></div>
        </div>
      </div>
    }
  `,
  standalone: true,
  imports: [EventsCatalogComponent, ModalWrapperModule],
})
export class EventsCatalogModalComponent {
  key!: string;
  isCompact = true;
  mode!: CatalogMode;
  view: View = 'modal';
  title?: string;
}
