import { SelectOption } from "src/app/_models/base/selectOption";
import { Companion } from "src/app/_models/companions/companion";
import { FamilyMedicalHistory } from "src/app/_models/familyMedicalHistories/familyMedicalHistory";
import { FamilyMember } from "src/app/_models/familyMembers/familyMember";
import { PersonalDrugHistory } from "src/app/_models/personalDrugHistories/personalDrugHistory";
import { PersonalMedicalHistory } from "src/app/_models/personalMedicalHistories/personalMedicalHistory";


export class MedicalRecord {
  patientName: string | null = null;
  age: number | null = null;
  sex: SelectOption | null = null;
  birthPlace: string | null = null;
  birthDate: Date | null = null;
  educationLevel: SelectOption | null = null;
  yearsOfSchooling: number | null = null;
  occupation: SelectOption | null = null;
  handDominance: SelectOption | null = null;
  maritalStatus: SelectOption | null = null;
  currentLivingSituation: string | null = null;
  currentAddress: string | null = null;
  homePhone: string | null = null;
  mobilePhone: string | null = null;
  email: string | null = null;
  hasCompanion: boolean | null = false;
  economicDependence: string | null = null;
  usesGlassesOrHearingAid: boolean | null = false;
  colorBlindness: SelectOption | null = null;

  companion: Companion = new Companion();

  familyMembers: FamilyMember[] = [new FamilyMember(),];
  personalMedicalHistory: PersonalMedicalHistory[] = [new PersonalMedicalHistory(),];
  personalDrugHistory: PersonalDrugHistory[] = [new PersonalDrugHistory(),];
  familyMedicalHistory: FamilyMedicalHistory[] = [new FamilyMedicalHistory(),];

  comments: string | null = null;

  constructor(init?: Partial<MedicalRecord>) {
    Object.assign(this, init);
  }
}
