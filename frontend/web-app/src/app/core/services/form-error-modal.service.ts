import { Component, Injectable, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormErrorModalService {
  private actions = new BehaviorSubject<boolean>(false);
  actions$ = this.actions.asObservable();

  ariaLabelledby = 'modal-title';
  ariaDescribedby = 'modal-body';
  ariaLive = 'assertive';
  ariaModal = true;
  ariaLabel = 'Close this dialog';
  role = 'dialog';
  tabindex = -1;

  show = () => this.actions.next(true);
  hide = () => this.actions.next(false);

  constructor() {}
}

@Component({
  selector: '[formErrorModal]',
  template: `
    <div
      class="modal fade swal2-modal swal2-show"
      bsModal
      #smModal="bs-modal"
      [tabindex]="service.tabindex"
      [attr.aria-labelledby]="service.ariaLabelledby"
      [attr.aria-describedby]="service.ariaDescribedby"
      [attr.role]="service.role"
      [attr.aria-modal]="service.ariaModal"
      [attr.aria-live]="service.ariaLive"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content" style="width: 32em!important;">
          <div
            class="modal-body text-center swal2-modal swal2-icon-error swal2-show swal2-popup"
          >
            <div class="swal2-icon swal2-error swal2-icon-show d-flex">
              <span class="swal2-x-mark">
                <span class="swal2-x-mark-line-left"></span>
                <span class="swal2-x-mark-line-right"></span>
              </span>
            </div>

            <div class="swal2-html-container">
              Importante, parece que se han detectado algunos errores, por favor
              inténtalo de nuevo.
            </div>

            <div class="swal2-actions d-flex justify-content-center">
              <button
                type="button"
                class="swal2-confirm btn btn-primary"
                aria-label=""
                (click)="hide()"
              >
                ¡Okay, entendido!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class FormErrorModalComponent {
  @ViewChild(ModalDirective, { static: true }) modal?: ModalDirective;

  constructor(public service: FormErrorModalService) {
    this.service.actions$.subscribe((show) => {
      if (show) this.show();
      else this.hide();
    });
  }

  hide = () => this.modal?.hide();
  show = () => this.modal?.show();
}
