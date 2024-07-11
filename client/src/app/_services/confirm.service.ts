import { Component, inject, Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { Observable, map } from 'rxjs';
import { Modal } from 'src/app/_models/modal';

@Component({
  selector: "confirm-modal",
  template: `
    <div class="modal-content rounded-3 shadow">
      <div class="modal-body p-4 text-center">
        <h5 class="mb-0">{{ modal.title }}</h5>
        <p class="mb-0">{{ modal.message }}</p>

      </div>
      <div class="modal-footer flex-nowrap p-0">
        <button type="button" (click)="result = true; bsModalRef.hide()"
                class="btn btn-lg btn-link fs--0 text-decoration-none col-6 py-3 m-0 rounded-0 border-end"><strong>
          {{ modal.btnOkText }}
        </strong></button>
        <button type="button" class="btn btn-lg btn-link fs--0 text-decoration-none col-6 py-3 m-0 rounded-0"
                (click)="bsModalRef.hide()">
          {{ modal.btnCancelText }}
        </button>
      </div>
    </div>
  `,
  standalone: true
})
export class ConfirmComponent {
  bsModalRef = inject(BsModalRef);

  modal!: Modal;
  result = false;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private service = inject(BsModalService);

  bsModalRef?: BsModalRef<ConfirmComponent>;

  constructor() {
    this.service.config.class = 'modal-dialog-centered';
    this.service.config = { class: 'modal-dialog-centered' };
  }

  confirm(modal?: Modal, config?: ModalOptions): Observable<boolean> {
    const defaultConfig: ModalOptions = {
      class: 'modal-dialog-centered',
      initialState: { modal }
    };

    const modalConfig = { ...defaultConfig, ...config };

    this.bsModalRef = this.service.show(ConfirmComponent, modalConfig);

    return this.bsModalRef.onHidden!.pipe(map(() => this.bsModalRef!.content!.result));
  }
}
