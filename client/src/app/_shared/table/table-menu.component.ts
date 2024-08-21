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
import { Entity } from 'src/app/_forms/form';
import { NamingSubject, TableCellItem } from 'src/app/_models/types';
import { IconsService } from 'src/app/_services/icons.service';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { MaterialModule } from 'src/app/_shared/material.module';

@Component({
  selector: 'td[tableCell]',
  template: `
  @if(item().isLink) {
    <div class="d-flex align-items-center px-0" [ngClass]="linkClass">
      <a [routerLink]="[item().url, value()]" [href]="[item().url, value()]" class="fw-semibold text-primary me-2">
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
  item = input.required<TableCellItem<any, any>>();
  isCompact = input.required<boolean>();
  value = input.required<any>();

  linkClass = 'd-flex align-items-center px-0';
  class = '';

  @HostBinding('class') get hostClass() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.isCompact()) {
        this.class = `${this.class}`;
      } else {
        this.class = `${this.class}`;
      }

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
  isCompact = input.required<boolean>();
  item = input.required<Entity>();

  class =
    'align-middle white-space-nowrap text-end pe-0 btn-reveal-trigger text-center';

  @HostBinding('class') get hostClasses() {
    return this.class;
  }

  constructor() {
    effect(() => {
      if (this.isCompact()) {
        this.class = `${this.class} py-1 fs-6 pe-3 ps-1 border-none`;
      }
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
  isCompact = input.required<boolean>();
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
      if (this.isCompact()) {
        this.class = `${this.class} py-1 pe-3 ps-1 border-none`;
      }
    });
  }
}
