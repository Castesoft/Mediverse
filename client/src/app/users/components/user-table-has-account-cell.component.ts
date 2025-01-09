import { Component, input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { User } from "../../_models/users/user";

@Component({
  selector: 'td[userHasAccount]',
  template: `
    @if (user().hasAccount) {
      <div class="badge badge-light-success fw-bold">
        Registrado
      </div>
    }
  `,
  standalone: true,
  imports: [ CommonModule, ],
})
export class UserTableHasAccountCellComponent {
  user = input.required<User>();
}
