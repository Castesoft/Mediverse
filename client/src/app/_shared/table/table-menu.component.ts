import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  HostBinding,
  inject,
  input,
  model,
  TemplateRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createId } from '@paralleldrive/cuid2';
import { Entity, NamingSubject, TableCellItem } from 'src/app/_models/types';
import { IconsService } from 'src/app/_services/icons.service';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';

@Component({
  selector: 'td[tableCell]',
  template: `
  @if(item().isLink) {
    <div class="d-flex align-items-center px-0" [ngClass]="linkClass">
      <a [routerLink]="[item().baseUrl, value()]" [href]="[item().baseUrl, value()]" class="fw-semibold text-primary me-2">
        @if(item().key === 'id') {
          #
        }
        {{value() | number}}</a>
    </div>
  }@else {
    {{value()}}
  }
  `,
  standalone: true,
  imports: [ RouterModule, CommonModule,],
})
export class TableCellComponent {
  item = model.required<TableCellItem<any, any>>();
  value = input.required<any>();

  linkClass = 'd-flex align-items-center px-0';
  class = '';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      switch (this.item().type) {
        case 'number':
          this.class = `${this.class} text-end`;
          this.linkClass = `${this.linkClass} justify-content-end`;
          break;
        case 'date':
          this.class = `${this.class} text-end`;
          this.linkClass = `${this.linkClass} justify-content-end`;
          break;
        case 'string':
          this.class = `${this.class} text-start`;
          this.linkClass = `${this.linkClass} justify-content-start`;
          break;
      }

      if (this.item().isLink) {
        this.class = ``;
      }
    })
  }
}

@Component({
  selector: 'td[tableCell2]',
  template: `
  <!-- {{ item() | json }} -->
  <!-- {{value() | json}} -->

  @if(item().isLink && item().key === 'id') {
    <div class="d-flex align-items-center px-0" [ngClass]="linkClass">
      <a [routerLink]="[item().baseUrl, value()]" [href]="[item().baseUrl, value()]" class="fw-semibold text-primary me-2">
        @if(item().key === 'id') {
          #
        }
        {{value() | number}}</a>
    </div>
  }@else if(item().isLink && item().type === 'code' && value()) {
    <div class="d-flex align-items-center px-0" [ngClass]="linkClass">
      <a [routerLink]="[item().baseUrl, value()!.id]" [href]="[item().baseUrl, value()!.id]" class="fw-semibold text-primary me-2">
        @if(value()!.id !== 0) {#}
        @if(value()!.code !== value()!.name) {({{ value()!.code}})}
        {{value()!.name}}
      </a>
    </div>
  }@else {
    @if(value()) {
      @switch(item().type) {
        @case ('code') {
          @if(value()!.id !== 0) {#}
          @if(value()!.code !== value()!.name) {({{ value()!.code}})}
          {{value()!.name}}
        }
        @case('date') {
          {{ value() | date : "dd/MM/yyyy" : "" : "es-MX" }}
        }
        @case ('number') {
          {{ value() | number }}
        }
        @case('currency') {
          {{ value() | currency : 'MXN' : 'symbol' : '1.2-2' }}
        }
        @case('boolean') {
          <div class="form-check mb-0 d-flex justify-content-center">
            <input class="form-check-input"
                   type="checkbox"
                   [id]="guid"
                   [checked]="value()"
                   disabled />
            <label class="form-check-label"
                   [for]="guid"></label>
          </div>
        }
        @default {
          {{ value() }}
        }
      }
      @if(item().unit) {
        {{ item().unit }}
      }
    }
  }
  `,
  standalone: true,
  imports: [ RouterModule, CommonModule,],
})
export class TableCell2Component {
  item = model.required<TableCellItem<any, any>>();
  value = input.required<any>();
  guid = createId();

  linkClass = 'd-flex align-items-center px-0';
  class = 'date align-middle white-space-nowrap text-start';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      this.class = `${this.class} py-1 fs-8 pe-3 ps-1 border-none`;
      switch (this.item().type) {
        case 'number':
          this.class = `${this.class} text-end`;
          this.linkClass = `${this.linkClass} justify-content-end`;
          break;
        case 'date':
          this.class = `${this.class} text-end`;
          this.linkClass = `${this.linkClass} justify-content-end`;
          break;
        case 'string':
          this.class = `${this.class} text-start`;
          this.linkClass = `${this.linkClass} justify-content-start`;
          break;
      }

      if (this.item().isLink) {
        this.class = `name align-middle white-space-nowrap px-0 py-0`;
      }

    })
  }
}


@Component({
  selector: 'td[tableMenuCell]',
  template: `
    <div class="font-sans-serif btn-reveal-trigger dropdown">
      <button
        class="btn btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs--2"
        [cdkContextMenuTriggerFor]="contextMenu()"
        [cdkMenuTriggerFor]="contextMenu()"
        [id]="'dropdown' + item().name + item().id"
        type="button"
        [attr.aria-controls]="'dropdown' + item().name + item().id"
      >
        <fa-icon [icon]="icons.faEllipsisH" class="fs-6"></fa-icon>
      </button>
    </div>
  `,
  standalone: true,
  imports: [MaterialModule, CdkModule, FontAwesomeModule],
})
export class TableMenuCellComponent {
  icons = inject(IconsService);

  contextMenu = input.required<TemplateRef<any>>();
  item = model.required<Entity>();

  class =
    'align-middle white-space-nowrap text-end pe-0 btn-reveal-trigger text-center';

  @HostBinding('class') get hostClasses() {
    return this.class;
  }

  constructor() {
    effect(() => {
      this.class = `${this.class} py-1 fs-6 pe-3 ps-1 border-none`;
    });
  }
}

@Component({
  selector: 'td[tableCheckCell]',
  template: `
    <div class="form-check mb-0 fs-6">
      <input
        class="form-check-input"
        type="checkbox"
        [(ngModel)]="selected"
        [name]="dictionary().singular"
        [id]="cuid + 'tableCheck' + idx()"
      />
    </div>
  `,
  standalone: true,
  imports: [FormsModule],
})
export class TableCheckCellComponent {
  idx = input.required<number>();
  dictionary = input.required<NamingSubject>();

  selected = model.required<boolean>();

  class = 'fs-6 align-middle';
  cuid = createId();

  @HostBinding('class') get hostClasses() {
    return this.class;
  }

  constructor() {
    effect(() => {
      this.class = `${this.class} py-1 pe-3 ps-1 border-none`;
    });
  }
}
