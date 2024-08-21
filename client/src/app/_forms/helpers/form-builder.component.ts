import { Component, computed, input, model } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ControlCheck2Component } from 'src/app/_forms/control-check2.component';
import { ControlChipsComponent } from 'src/app/_forms/control-chips.component';
import { ControlDateRangeComponent } from 'src/app/_forms/control-date-range.component';
import { ControlDate2Component } from 'src/app/_forms/control-date2.component';
import { ControlSearchDateComponent } from 'src/app/_forms/control-search-date.component';
import { ControlSearchTextComponent } from 'src/app/_forms/control-search-text.component';
import { ControlSelect2Component } from 'src/app/_forms/control-select2.component';
import { ControlSlideComponent } from 'src/app/_forms/control-slide.component';
import { ControlTextComponent } from 'src/app/_forms/control-text.component';
import { ControlTextarea2Component } from 'src/app/_forms/control-textarea2.component';
import { ControlTypeahead2Component } from 'src/app/_forms/control-typeahead2.component';
import { Control, ControlRows, EntityParams, Form } from 'src/app/_forms/form';
import { ControlsRowComponent, ControlsWrapperComponent } from 'src/app/_forms/helpers/controls-wrapper.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';

@Component({
  selector: 'div[formBuilder]',
  template: `
  <div controlsRow [grid]="rows()" [orientation]="orientation()">
    @for (item of controls(); let idx = $index; track idx) {
        @if(!item.control.hidden) {
          <div controlsWrapper>
        <!-- {{item.control.label}} -->
        @switch(item.control.type) {
          @case('select') {
            <div controlSelect2
              [(control)]="item.control"
            ></div>
          }
          @case('check') {
            <div controlCheck2
              [(control)]="item.control"
            ></div>
          }
          @case('chips') {
            <div controlChips [(control)]="item.control" ></div>
          }
          @case('slideToggle') {
            <div controlSlide
              [(control)]="item.control"
            ></div>
          }
          @case('textarea') {
            <div controlTextarea2
              [(control)]="item.control"
            ></div>
          }
          @case('text') {
            <div controlText
              [(control)]="item.control"
            ></div>
          }
          @case('number') {
            <div controlText
              [(control)]="item.control"
            ></div>
          }
          @case('date') {
            <div
              controlDate2
              [(control)]="item.control"
            ></div>
          }
          @case('search') {
            <div
              controlSearchText
              [(control)]="item.control"
            ></div>
          }
          <!-- @case('searchDate') {
            <div
              controlSearchDate
              [(control)]="item.control"
            ></div>
          } -->
          @case('dateRange') {
            @if(form()) {
              <div
              controlDateRange
              [(form)]="form"
            ></div>
            }
          }
        }
      </div>
        }
      }
      <ng-content></ng-content>
  </div>
  `,
  standalone: true,
  imports: [ InputControlComponent, ControlDate2Component, ReactiveFormsModule, FormsModule, ControlsWrapperComponent, ControlsRowComponent,
    ControlTextComponent, ControlSelect2Component, ControlTextarea2Component, ControlTypeahead2Component, ControlChipsComponent, ControlSlideComponent,
    ControlSearchTextComponent, ControlSearchDateComponent, ControlDateRangeComponent, ControlCheck2Component,
  ],
})
export class FormBuilderComponent {
  controls = model.required<{control:Control<any>}[]>();
  form = model<Form<any extends EntityParams<any> ? any : any> | any>({} as any);
  rows = input<ControlRows>('responsive');

  orientation = computed(() => this.controls()[0].control.orientation!);
}
