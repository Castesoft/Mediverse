import { Component, ViewChild } from '@angular/core';
import { patients } from '../../data/patients';
import { TabDirective, TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'account-main-route',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  @ViewChild('staticTabs', { static: false }) staticTabs!: TabsetComponent;

  patient = patients[1];
  activeTabId: string = 'tab1';

  onSelect(data: TabDirective): void {
    if (data.id) {
      console.log('Selected Tab Id: ', data.id);
      this.activeTabId = data.id;
    }
  }
}
