import { FormInfo } from "src/app/_forms/form2";
import { accountFormInfo } from "./account/accountConstants";
import { Account } from "./account/account";

export class DoctorReview {
  rating: number | null = null;
  comment: string | null = null;
  createdAt: Date | null = null;
  account: Account = new Account();

  constructor(init?: Partial<DoctorReview>) {
    Object.assign(this, init);
  }
}

export const doctorReviewInfo: FormInfo<DoctorReview> = {
  account: accountFormInfo,
  comment: { label: 'Comentario', type: 'text' },
  createdAt: { label: 'Creado en', type: 'date' },
  rating: { label: 'Calificación', type: 'number' },
} as FormInfo<DoctorReview>;
