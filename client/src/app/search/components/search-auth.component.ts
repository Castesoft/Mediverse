import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BsDropdownDirective, BsDropdownModule } from "ngx-bootstrap/dropdown";
import { AccountService } from "src/app/_services/account.service";
import { UserDropdownComponent } from "src/app/_shared/layout/user-dropdown.component";

@Component({
  host: { class: 'position-absolute top-0 end-0 p-4', },
  selector: 'div[searchAuth]',
  templateUrl: './search-auth.component.html',
  styleUrl: './search-auth.component.scss',
  standalone: true,
  providers: [BsDropdownDirective,],
  imports: [CommonModule, RouterModule, UserDropdownComponent, BsDropdownModule,],
})

export class SearchAuthComponent {
  service = inject(AccountService);
}
