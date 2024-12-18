import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from "src/app/_models/users/user";
import { UsersService } from "src/app/users/users.config";

@Component({
  selector: 'td[patientHasAccount]',
  template: `
    @if (patient()?.hasAccount) {
      <div class="badge badge-light-success fw-bold">
        Registrado
      </div>
    }
  `,
  standalone: true,
  imports: [CommonModule,],
})
export class PatientTableHasAccountCellComponent {
  patient = input.required<User | null>();
}

@Component({
  selector: 'td[patientSex]',
  template: `
    <div [ngClass]="{ 'badge-light-primary': patient()?.sex?.name === 'Masculino', 'badge-light-warning': patient()?.sex?.name === 'Femenino'}"
         class="badge fw-bold">
      {{ patient()?.sex }}
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class PatientTableSexCellComponent {
  patient = input.required<User | null>();
}

@Component({
  host: { class: 'd-flex align-items-center' },
  selector: 'td[patientCell], div[patientCell]',
  template: `
    @if (routerLink) {
      <div class="symbol symbol-circle symbol-50px overflow-hidden me-3">
        <a [routerLink]="[routerLink]">
          <div class="symbol-label">
            @if (patient()?.photoUrl) {
              <img [src]="patient()?.photoUrl"
                   alt="Emma Smith"
                   class="w-100"/>
            } @else {
              <div class="symbol-label fs-3 bg-light-danger text-danger">
                {{ patient()?.firstName![0] }}
              </div>
            }
          </div>
        </a>
      </div>
      <div class="d-flex flex-column">
        <a
          [routerLink]="[routerLink]"
          class="text-gray-800 text-hover-primary mb-1"
        >{{ patient()?.fullName }}</a
        >
        <span>{{ patient()?.email }}</span>
      </div>
    }
  `,
  standalone: true,
  imports: [RouterModule],
})
export class PatientTableCellComponent implements OnInit {
  service = inject(UsersService);

  patient = input.required<User | null>();

  routerLink?: string;

  ngOnInit(): void {
    this.routerLink = `${this.patient()?.id}`;
  }
}
