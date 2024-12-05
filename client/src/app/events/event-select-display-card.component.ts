import { Component, inject, input, model, OnInit } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { RouterLink } from "@angular/router";
import { Event } from "../_models/events/event";
import { IconsService } from "../_services/icons.service";
import { faEye } from "@fortawesome/free-regular-svg-icons";
import { DatePipe } from "@angular/common";

@Component({
  selector: '[eventSelectDisplayCard]',
  templateUrl: 'event-select-display-card.component.html',
  imports: [
    FaIconComponent,
    RouterLink,
    DatePipe
  ],
  standalone: true,
})
export class EventSelectDisplayCardComponent implements OnInit {
  icons = inject(IconsService);

  title = input<string>();
  item = input<Event>();
  key = model.required<string>();

  ngOnInit(): void {}

  protected readonly faEye = faEye;
}
