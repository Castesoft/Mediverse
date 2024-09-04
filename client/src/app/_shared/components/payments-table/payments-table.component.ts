import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { Payment } from 'src/app/_models/payment';

@Component({
  selector: 'app-payments-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments-table.component.html',
  styleUrl: './payments-table.component.scss'
})
export class PaymentsTableComponent {
  title = input.required<string>();
  payments = input.required<Payment[]>();
  showTabs = input.required<boolean>();
}
