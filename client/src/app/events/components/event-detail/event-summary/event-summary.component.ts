import { Component, inject, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilePictureComponent } from 'src/app/users/components/profile-picture/profile-picture.component';
import Event from "src/app/_models/events/event";
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-event-summary',
  standalone: true,
  imports: [CommonModule, ProfilePictureComponent],
  templateUrl: './event-summary.component.html',
})
export class EventSummaryComponent {
  orientation = input<'vertical' | 'horizontal'>('horizontal');
  router = inject(Router);
  private modalService = inject(BsModalService);

  item = model.required<Event>();
  summaryMode = input.required<boolean>();

  goToEvent() {
    this.router.navigate(['/home/events', this.item().id]);
    this.modalService.hide();
  }
}
