import {Component, inject, input, model, OnInit} from "@angular/core";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {User} from "../_models/user";
import {IconsService} from "../_services/icons.service";
import {faEye} from "@fortawesome/free-regular-svg-icons";

@Component({
selector: '[nurseSummaryCard]',
  templateUrl: 'nurse-summary-card.component.html',
  imports: [
    FaIconComponent,
    RouterLink
  ],
  standalone: true,
})
export class NurseSummaryCardComponent implements OnInit {
  icons = inject(IconsService);

  title = input<string>();
  item = model.required<User>();
  key = model.required<string>();

  ngOnInit(): void {
  }

  protected readonly faEye = faEye;
}
