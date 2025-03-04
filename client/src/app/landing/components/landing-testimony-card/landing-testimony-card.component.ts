import { Component, input, InputSignal } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'div[landingTestimonyCard]',
  templateUrl: './landing-testimony-card.component.html',
  imports: [
    NgClass
  ],
  styleUrl: '../landing.component.scss'
})
export class LandingTestimonyCardComponent {
  body: InputSignal<string> = input.required();
  name: InputSignal<string> = input.required();
  index: InputSignal<number> = input.required();

  get imgSrc(): string {
    if (this.index() % 2 === 0) {
      return 'media/landing/cards/card-testimony-avatar.svg';
    } else {
      return 'media/landing/cards/card-testimony-avatar-mild.svg';
    }
  }

  get bgColor(): string {
    if (this.index() % 2 === 0) {
      return 'bg-white';
    } else {
      return 'bg-secondary-mild';
    }
  }
}
