import { Component, input } from "@angular/core";
import { Account } from "src/app/_models/account/account";
import { OnlineBadgeComponent } from "src/app/_shared/template/components/online-badge.component";
import { SymbolLabelComponent } from "./symbol-label.component";


@Component({
  host: { class: 'symbol symbol-100px symbol-lg-160px symbol-fixed position-relative', },
  selector: 'div[symbol]',
  template: `
    @if(account().photoUrl){<img [src]="account().photoUrl" alt="image">}
    @else if(account().firstName) {<span symbolLabel [label]="account().firstName!"></span>}
    <div onlineBadge></div>
  `,
  standalone: true,
  imports: [SymbolLabelComponent, OnlineBadgeComponent],
})
export class SymbolComponent {
  account = input.required<Account>();
}
