import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { MedicineSelectModalComponent } from './medicine-select-modal.component';
import { Sex } from '../../_models/user';
import { CatalogMode } from '../../_models/types';

@Injectable({
  providedIn: 'root',
})
export class MedicinesSelectModalService {
  modal?: BsModalRef<MedicineSelectModalComponent>;
  visible = false;

  show = (mode: CatalogMode, formId: string): void => {
    this.modal = this.service.show(MedicineSelectModalComponent, this.getConfig(mode, formId));
    this.visible = true;
   };

  hide = (): void => { this.modal?.hide(); this.visible = false; };

  constructor(private service: BsModalService) {
    this.service.config.class = 'modal-lg modal-dialog-centered modal-dialog-scrollable';
    this.service.config = { class: 'modal-lg modal-dialog-centered modal-dialog-scrollable' };
  }

  getConfig = (mode: CatalogMode, formId: string): ModalOptions<MedicineSelectModalComponent> => {
    return {
      class: 'modal-xl modal-dialog-centered modal-dialog-scrollable',
      initialState: {
        mode: mode,
        formId: formId,
      }
    }
  }
}
