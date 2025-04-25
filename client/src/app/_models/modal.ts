export interface IModal {
  title: string;
  message: string;
  btnOkText: string;
  btnCancelText: string;
  result: boolean | null;
  /**
   * Optional color variant for the confirm button
   * - danger
   * - primary (default)
   * - secondary
   * - success
   * - warning
   * - info
   */
  btnColor?: 'danger' | 'primary' | 'secondary' | 'success' | 'warning' | 'info';
}

export class Modal implements IModal {
  title: string = 'Confirmación';
  message: string = '¿Quieres continuar?';
  btnOkText: string = 'Ok';
  btnCancelText: string = 'Cancelar';
  result: boolean | null = null;
  btnColor: 'danger' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' = 'primary';

  constructor(init?: Partial<Modal>) {
    Object.assign(this, init);

    this.title = this.title ?? 'Confirmación';
    this.message = this.message ?? '¿Quieres continuar?';
    this.btnOkText = this.btnOkText ?? 'Ok';
    this.btnCancelText = this.btnCancelText ?? 'Cancelar';
    this.btnColor = this.btnColor || 'primary';
  }
}
