import { FormInfo } from "src/app/_forms/form2";

export class AvailableTime {
  start: string | null = null;
  end: string | null = null;
  available: boolean = false;

  constructor(init?: Partial<AvailableTime>) {
    Object.assign(this, init);
  }
}

export const availableTimeInfo: FormInfo<AvailableTime> = {
  available: { label: 'Disponible', type: 'checkbox' },
  end: { label: 'Fin', type: 'text' },
  start: { label: 'Inicio', type: 'text' },
} as FormInfo<AvailableTime>;
