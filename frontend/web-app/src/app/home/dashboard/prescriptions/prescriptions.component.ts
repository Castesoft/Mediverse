import { Component } from '@angular/core';
import { prescriptions } from '../../../data/prescriptions';

@Component({
  selector: 'prescriptions',
  templateUrl: './prescriptions.component.html',
})
export class PrescriptionsComponent {
  prescriptions = prescriptions;
}
