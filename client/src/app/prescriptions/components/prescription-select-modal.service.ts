import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PrescriptionSelectModalComponent } from './prescription-select-modal.component';
import { Sex } from '../../../_models/types';

@Injectable({
  providedIn: 'root',
})
export class PrescriptionsSelectModalService {
  modal?: BsModalRef<PrescriptionSelectModalComponent>;
  visible = false;

  show = (sex: Sex): void => {
    this.modal = this.service.show(PrescriptionSelectModalComponent, this.getConfig(sex));
    this.visible = true;
   };

  hide = (): void => { this.modal?.hide(); this.visible = false; };

  constructor(private service: BsModalService) {
    this.service.config.class = 'modal-lg modal-dialog-centered modal-dialog-scrollable';
    this.service.config = { class: 'modal-lg modal-dialog-centered modal-dialog-scrollable' };
  }

  getConfig = (sex: Sex): ModalOptions<PrescriptionSelectModalComponent> => {
    return {
      class: 'modal-xl modal-dialog-centered modal-dialog-scrollable',
      initialState: {
        sex: sex,
      }
    }
  }
}
