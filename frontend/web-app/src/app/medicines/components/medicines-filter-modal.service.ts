import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MedicinesFilterModalComponent } from './medicines-filter-modal.component';

@Injectable({
  providedIn: 'root',
})
export class MedicinesFilterModalService {
  modal?: BsModalRef<MedicinesFilterModalComponent>;
  visible = false;

  show = (formId: string): void => {
    this.modal = this.service.show(MedicinesFilterModalComponent, this.getConfig(formId));
    this.visible = true;
   };

  hide = (): void => { this.modal?.hide(); this.visible = false; };

  constructor(private service: BsModalService) {
    this.service.config.class = 'modal-dialog-centered';
    this.service.config = { class: 'modal-dialog-centered' };
  }

  getConfig = (formId: string): ModalOptions<MedicinesFilterModalComponent> => {
    return {
      class: 'modal-dialog-centered',
      initialState: {
        formId: formId,
      }
    }
  }

}
