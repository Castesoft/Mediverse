@Injectable({
  providedIn: 'root',
})
export class OccupationsService extends ServiceHelper<Occupation, OccupationParams, FormGroup2<OccupationParams>> {
  constructor() {
    super(OccupationParams, 'occupations', new NamingSubject(
      'feminine',
      'especialidad',
      'especialidades',
      'Especialidades',
      'occupations',
      ['admin', 'utilerias', 'codigos'],
    ), [
      { name: 'id', label: 'ID' },
      { name: 'code', label: 'Código' },
      { name: 'name', label: 'Nombre' },
      { name: 'description', label: 'Descripción' },
      new Column('createdAt', 'Creado', { options: { justify: 'end', }}),
      { name: 'visible', label: 'Visible' },
      { name: 'enabled', label: 'Habilitado' },
    ]);
  }
}
