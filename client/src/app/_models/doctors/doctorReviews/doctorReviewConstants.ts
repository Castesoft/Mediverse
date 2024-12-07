import { accountFormInfo } from "src/app/_models/account/accountConstants";
import { DoctorReview } from "src/app/_models/doctors/doctorReviews/doctorReview";
import { FormInfo } from "src/app/_models/forms/formTypes";


export const doctorReviewFormInfo: FormInfo<DoctorReview> = {
  account: accountFormInfo,
  comment: { label: 'Comentario', type: 'text' },
  createdAt: { label: 'Creado en', type: 'date' },
  rating: { label: 'Calificación', type: 'number' },
} as FormInfo<DoctorReview>;
