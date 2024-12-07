
export class DoctorClinic {
  id: number | null = null;
  isMain: boolean = false;
  street: string | null = null;
  neighborhood: string | null = null;
  exteriorNumber: string | null = null;
  interiorNumber: string | null = null;
  city: string | null = null;
  state: string | null = null;
  country: string | null = null;
  zipcode: string | null = null;
  latitude: number | null = null;
  longitude: number | null = null;
  logoUrl: string | null = null;

  constructor(init?: Partial<DoctorClinic>) {
    Object.assign(this, init);
  }
}
