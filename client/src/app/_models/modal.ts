export class Modal {
  title: string | null = 'Confirmación';
  message: string | null = '¿Quieres continuar?';
  btnOkText: string | null = 'Ok';
  btnCancelText: string | null = 'Cancelar';
  result: boolean | null = null;

  constructor(init?: Partial<Modal>) {
    Object.assign(this, init);

    if (this.title === null) this.title = 'Confirmación';
    if (this.message === null) this.message = '¿Quieres continuar?';
    if (this.btnOkText === null) this.btnOkText = 'Ok';
    if (this.btnCancelText === null) this.btnCancelText = 'Cancelar';
  }
}

export interface IModal {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
  result: boolean | null;
}
