import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-footer',
  templateUrl: './landing-footer.component.html',
  styleUrl: '../landing.component.scss'
})
export class LandingFooterComponent implements OnInit {
  currentYear: number = 0;

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }
}
