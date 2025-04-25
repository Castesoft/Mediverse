import { EntityParams } from "src/app/_models/base/entityParams";
import { DoctorAssociation } from "src/app/_models/doctorAssociations/doctorAssociation";

export class DoctorAssociationParams extends EntityParams<DoctorAssociation> {
  doctorId: number | null = null;
  nurseId: number | null = null;
  doctorName: string | null = null;
  nurseName: string | null = null;
  doctorSpecialty: string | null = null;

  constructor(key: string | null, init?: Partial<DoctorAssociationParams>) {
    super(key);
    Object.assign(this, init);
  }
}
