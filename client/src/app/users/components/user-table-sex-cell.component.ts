import { Component, input } from "@angular/core";
import { NgClass } from "@angular/common";
import { User } from "../../_models/users/user";

@Component({
  selector: 'td[userSex]',
  template: `
    <div class="badge fw-bold"
         [ngClass]="{ 'badge-light-primary': user().sex?.name === 'Masculino', 'badge-light-warning': user().sex?.name === 'Femenino'}">
      {{ user().sex }}
    </div>
  `,
  standalone: true,
  imports: [ NgClass ],
})
export class UserTableSexCellComponent {
  user = input.required<User>();
}
