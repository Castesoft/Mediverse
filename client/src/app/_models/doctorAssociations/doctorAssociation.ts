import { Entity } from "src/app/_models/base/entity";

export class DoctorAssociation extends Entity {
  doctorId!: number;
  nurseId!: number;

  doctorName?: string;
  doctorEmail?: string;
  doctorPhotoUrl?: string | null;
  doctorSpecialty?: string | null;

  nurseName?: string;
  nurseEmail?: string;
  nursePhotoUrl?: string | null;

  associationDate!: Date;

  constructor(init?: Partial<DoctorAssociation>) {
    super();
    Object.assign(this, init);

    if (init?.createdAt) {
      this.associationDate = init?.createdAt;
    }
  }
}
