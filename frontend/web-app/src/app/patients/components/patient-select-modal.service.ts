import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PatientSelectModalComponent } from './patient-select-modal.component';

@Injectable({
  providedIn: 'root',
})
export class PatientsSelectModalService {
  modal?: BsModalRef<PatientSelectModalComponent>;
  visible = false;

  show = (formId: string): void => {
    this.modal = this.service.show(PatientSelectModalComponent, this.getConfig("awdawdawd"));
    this.visible = true;
   };

  hide = (): void => { this.modal?.hide(); this.visible = false; };

  constructor(private service: BsModalService) {
    this.service.config.class = 'modal-lg modal-dialog-centered modal-dialog-scrollable';
    this.service.config = { class: 'modal-lg modal-dialog-centered modal-dialog-scrollable' };
  }

  getConfig = (formId: string): ModalOptions<PatientSelectModalComponent> => {
    return {
      class: 'modal-xl modal-dialog-centered modal-dialog-scrollable',
      initialState: {
        formId: formId,
      }
    }
  }
}
