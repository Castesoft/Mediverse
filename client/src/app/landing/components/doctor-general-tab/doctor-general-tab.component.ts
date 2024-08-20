import { Component, input } from '@angular/core';
import { DoctorSearchResult } from 'src/app/_models/doctorSearchResults';

@Component({
  selector: 'app-doctor-general-tab',
  standalone: true,
  imports: [],
  templateUrl: './doctor-general-tab.component.html',
  styleUrl: './doctor-general-tab.component.scss'
})
export class DoctorGeneralTabComponent {
  doctor = input<DoctorSearchResult>();
}
