import { addressFormInfo } from 'src/app/_models/addresses/addressConstants';
import { Column } from 'src/app/_models/base/column';
import { baseInfo } from 'src/app/_models/base/entity';
import { baseFilterFormInfo } from 'src/app/_models/base/entityParams';
import { NamingSubject } from 'src/app/_models/base/namingSubject';
import { doctorFormInfo } from 'src/app/_models/doctors/doctorConstants';
import { FormInfo } from 'src/app/_models/forms/formTypes';
import { patientFormInfo } from 'src/app/_models/patients/patientConstants';
import { prescriptionItemInfo } from 'src/app/_models/prescriptionItem';
import { Prescription } from 'src/app/_models/prescriptions/prescription';
import { PrescriptionParams } from 'src/app/_models/prescriptions/prescriptionParams';
import { baseTableCells, PartialCellsOf } from 'src/app/_models/tables/tableCellItem';


export const prescriptionFormInfo: FormInfo<Prescription> = {
  ...baseInfo,
  doctor: doctorFormInfo,
  exchangeAmount: { label: 'Monto de cambio', type: 'number', },
  isCollapsed: { label: 'Colapsado', type: 'checkbox', },
  items: prescriptionItemInfo,
  product: { label: 'Productos', type: 'typeahead', },
  logoUrl: { label: 'URL del logo', type: 'text', },
  notes: { label: 'Notas', type: 'textarea', },
  orderId: { label: 'ID de pedido', type: 'number', },
  date: { label: 'Fecha', type: 'date', },
  patient: {
    ...patientFormInfo,
  },
  clinic: addressFormInfo,
} as FormInfo<Prescription>;

export const prescriptionFiltersFormInfo: FormInfo<PrescriptionParams> = {
  ...baseFilterFormInfo,
} as FormInfo<PrescriptionParams>;

export const prescriptionDictionary: NamingSubject = new NamingSubject(
  'feminine',
  'receta',
  'recetas',
  'Recetas',
  'prescriptions',
);

export const prescriptionColumns: Column[] = [
  new Column('patient', 'Paciente'),
  new Column('date', 'Fecha'),
];

export const prescriptionCells: PartialCellsOf<Prescription> = {
  ...baseTableCells,
} as PartialCellsOf<Prescription>;
