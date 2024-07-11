import { NgClass } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Role } from 'src/app/_models/types';
import { Event } from 'src/app/_models/event';
import { EventsService } from 'src/app/_services/events.service';

@Component({
  selector: 'td[eventHasAccount]',
  template: `
  @if(event().hasAccount) {
    <div class="badge badge-light-success fw-bold">
      Registrado
    </div>
  }
  `,
  standalone: true,
  imports: [ NgClass ],
})
export class EventTableHasAccountCellComponent {
  event = input.required<Event>();
}

@Component({
  selector: 'td[eventSex]',
  template: `
    <div class="badge fw-bold"
      [ngClass]="{ 'badge-light-primary': event().sex === 'Masculino', 'badge-light-warning': event().sex === 'Femenino'}">
      {{event().sex}}
    </div>
  `,
  standalone: true,
  imports: [ NgClass ],
})
export class EventTableSexCellComponent {
  event = input.required<Event>();
}

@Component({
  host: { class: 'd-flex align-items-center' },
  selector: 'td[eventCell]',
  template: `
    @if (routerLink) {
    <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
      <a [routerLink]="[routerLink]">
        <div class="symbol-label">
          @if (event().photoUrl) {
          <img [src]="event().photoUrl" alt="Emma Smith" class="w-100" />
          } @else {
          <div class="symbol-label fs-3 bg-light-danger text-danger">
            {{ event().firstName[0] }}
          </div>
          }
        </div>
      </a>
    </div>
    <div class="d-flex flex-column">
      <a
        [routerLink]="[routerLink]"
        class="text-gray-800 text-hover-primary mb-1"
        >{{ event().fullName }}</a
      >
      <span>{{ event().email }}</span>
    </div>
    }
  `,
  standalone: true,
  imports: [RouterModule],
})
export class EventTableCellComponent implements OnInit {
  service = inject(EventsService);

  event = input.required<Event>();

  routerLink?: string;

  ngOnInit(): void {
    this.routerLink = `${
      this.service.naming!.catalogRoute
    }/${this.event().id}`;
  }
}
