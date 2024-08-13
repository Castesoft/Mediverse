import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Prescription } from 'src/app/_models/prescription';
import { FormUse, View } from 'src/app/_models/types';
import { PrescriptionFormComponent } from "src/app/prescriptions/components/prescription-form/prescription-form.component";

@Component({
  selector: 'app-prescription-new',
  standalone: true,
  imports: [PrescriptionFormComponent],
  templateUrl: './prescription-new.component.html',
  styleUrl: './prescription-new.component.scss'
})
export class PrescriptionNewComponent implements OnInit {
  private router = inject(Router);

  // View Configuration
  use: FormUse = 'create';
  view: View = 'page';

  item?: Prescription;
  id?: number;
  key?: string;
  label?: string;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    this.key = navigation?.extras?.state?.['key'];
  }
}
