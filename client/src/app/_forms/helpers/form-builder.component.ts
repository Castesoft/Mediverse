import { Component, computed, input, model } from '@angular/core';
import { ControlChipsComponent } from 'src/app/_forms/control-chips.component';
import { ControlDateRangeComponent } from 'src/app/_forms/control-date-range.component';
import { ControlDateComponent } from 'src/app/_forms/control-date.component';
import { ControlSearchDateComponent } from 'src/app/_forms/control-search-date.component';
import { ControlSearchTextComponent } from 'src/app/_forms/control-search-text.component';
import { ControlSlideComponent } from 'src/app/_forms/control-slide.component';
import { ControlTextComponent } from 'src/app/_forms/control-text.component';
import { ControlsRowComponent, ControlsWrapperComponent } from 'src/app/_forms/helpers/controls-wrapper.component';
import { InputControlComponent } from 'src/app/_forms/input-control.component';
import { ControlSelect2Component } from "src/app/_forms/control-select-2.component";
import { ControlSelectComponent } from 'src/app/_forms/control-select.component';
import { ControlTextarea2Component } from 'src/app/_forms/control-textarea2.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Control, ControlRows, Form } from 'src/app/_forms/form';
import { EntityParams } from 'src/app/_models/types';

@Component({
  selector: 'div[formBuilder]',
  template: `
    <div [grid]="rows()"
         [orientation]="orientation()"
         controlsRow>
      @for (item of controls(); let idx = $index; track idx) {
        @if (!item.control.hidden) {
          <div controlsWrapper>
            <!-- {{item.control.label}} -->
            @switch (item.control.type) {
              @case ('select') {
                <div controlSelect2
                     [(control)]="item.control"
                ></div>
              }
              @case ('select2') {
                <div controlSelect2
                     [(control)]="item.control"
                ></div>
              }
              @case ('chips') {
                <div controlChips
                     [(control)]="item.control"></div>
              }
              @case ('slideToggle') {
                <div controlSlide
                     [(control)]="item.control"
                ></div>
              }
              @case ('textarea') {
                <div controlTextarea2
                     [(control)]="item.control"
                ></div>
              }
              @case ('text') {
                <div controlText
                     [(control)]="item.control"
                ></div>
              }
              @case ('number') {
                <div controlText
                     [(control)]="item.control"
                ></div>
              }
              @case ('date') {
                <p>pending</p>
                <!-- <div
                  controlDate
                  [(control)]="item.control"
                ></div> -->
              }
              @case ('search') {
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
              @case ('dateRange') {
                @if (form()) {
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
  imports: [ InputControlComponent, ControlDateComponent, ReactiveFormsModule, FormsModule, ControlsWrapperComponent, ControlsRowComponent,
    ControlTextComponent, ControlSelect2Component, ControlTextarea2Component, ControlChipsComponent, ControlSlideComponent,
    ControlSearchTextComponent, ControlSearchDateComponent, ControlDateRangeComponent, ControlSelectComponent,
  ],
})
export class FormBuilderComponent {
  controls = model.required<{control:Control<any>}[]>();
  form = model<Form<any extends EntityParams<any> ? any : any> | any>({} as any);
  rows = input<ControlRows>('responsive');

  orientation = computed(() => this.controls()[0].control.orientation!);
}
