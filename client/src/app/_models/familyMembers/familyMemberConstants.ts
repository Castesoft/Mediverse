import { Validators } from "@angular/forms";
import { FamilyMember } from "src/app/_models/familyMembers/familyMember";
import { FormInfo } from "src/app/_models/forms/formTypes";


export const familyMemberFormInfo: FormInfo<FamilyMember> = {
  id: { label: 'ID', type: 'number' },
  age: { label: 'Edad', type: 'number', validators: [Validators.required, Validators.min(0), Validators.max(150)] },
  name: { label: 'Nombre', type: 'text', validators: [Validators.required] },
  relativeType: { label: 'Parentesco', type: 'select', showCodeSpan: false },
} as FormInfo<FamilyMember>;
