import { Entity } from "src/app/_models/base/entity";
import { SelectOption } from "src/app/_models/base/selectOption";


export class UserSummary extends Entity {
  firstName: string | null = null;
  lastName: string | null = null;
  fullName: string | null = null;
  dateOfBirth: Date | null = null;
  email: string | null = null;
  sex: SelectOption | null = null;
  age: string | null = null;
  photoUrl: string | null = null;

  constructor(init?: Partial<UserSummary>) {
    super();

    Object.assign(this, init);
  }
}
