import { CommonModule } from '@angular/common';
import { Component, inject, input, model, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { Event } from 'src/app/_models/events/event';
import { IconsService } from 'src/app/_services/icons.service';

@Component({
  selector: '[eventSelectDisplayCard]',
  templateUrl: 'event-select-display-card.component.html',
  imports: [ RouterModule, CommonModule],
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
