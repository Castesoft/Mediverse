import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PrescriptionsFilterModalComponent } from './prescriptions-filter-modal.component';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionsFilterModalService {
  modal?: BsModalRef<PrescriptionsFilterModalComponent>;
  visible = false;

  show = (formId: string): void => {
    this.modal = this.service.show(PrescriptionsFilterModalComponent, this.getConfig(formId));
    this.visible = true;
   };

  hide = (): void => { this.modal?.hide(); this.visible = false; };

  constructor(private service: BsModalService) {
    this.service.config.class = 'modal-dialog-centered';
    this.service.config = { class: 'modal-dialog-centered' };
  }

  getConfig = (formId: string): ModalOptions<PrescriptionsFilterModalComponent> => {
    return {
      class: 'modal-dialog-centered',
      initialState: {
        formId: formId,
      }
    }
  }

}
