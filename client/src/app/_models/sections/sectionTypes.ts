export type Section = {
  label: string;
  route: string;
};

export type Sections =
'admin' |
'nurses' |
'orders' |
'patients' |
'specialties' |
'diseases' |
'substances' |
'consumptionLevels' |
'relativeTypes' |
'colorBlindnesses' |
'maritalStatuses' |
'educationLevels' |
'occupations' |
'utils' |
'reports' |
'events' |
'services' |
'users' |
'medicines' |
'customers' | 'addresses' | 'products' | 'prescriptions' | 'clinics';
;

export type SectionDictionary = {
  [key in Sections]: Section;
};
