import { Component, input, InputSignal } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'div[landingCard]',
  templateUrl: './landing-card.component.html',
  styleUrl: '../landing.component.scss',
  imports: [ NgClass ],
})
export class LandingCardComponent {
  colorClass: InputSignal<string> = input.required();
  altBackground: InputSignal<boolean> = input(false);
  text: InputSignal<string> = input.required();
  title: InputSignal<string> = input.required();
}
