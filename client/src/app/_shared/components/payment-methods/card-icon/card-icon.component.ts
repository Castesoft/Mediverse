import { Component, effect, inject, input, InputSignal } from '@angular/core';
import { Theme, ThemeService } from 'src/app/_services/theme.service';
import { CardIconSize } from "src/app/_shared/components/payment-methods/card-icon/cardIconSize";
import { TitleCasePipe } from "@angular/common";
import { CardBrand } from "src/app/_shared/components/payment-methods/card-icon/cardBrand";

@Component({
  selector: 'div[cardIcon]',
  standalone: true,
  templateUrl: './card-icon.component.html',
  styleUrls: [ './card-icon.component.scss' ],
  imports: [ TitleCasePipe ],
})
export class CardIconComponent {
  brand: InputSignal<CardBrand> = input.required();
  size: InputSignal<CardIconSize> = input(CardIconSize.Medium as CardIconSize);

  private themeService: ThemeService = inject(ThemeService);

  imgRoute: string = '';

  private readonly routes: { [key: string]: { light: string; dark: string } } = {
    visa: {
      light: 'media/svg/card-logos/visa.svg',
      dark: 'media/svg/card-logos/visa-dark.svg'
    },
    mastercard: {
      light: 'media/svg/card-logos/mastercard.svg',
      dark: 'media/svg/card-logos/mastercard-dark.svg'
    },
    amex: {
      light: 'media/svg/card-logos/american-express.svg',
      dark: 'media/svg/card-logos/american-express-dark.svg'
    }
  };

  constructor() {
    effect(() => {
      const theme: Theme = this.themeService.theme();
      const key: string = this.brand()?.toString().toLowerCase() || '';

      if (theme === 'dark') {
        if (key && this.routes[key]) {
          this.imgRoute = this.routes[key].dark;
        } else {
          this.imgRoute = 'media/svg/card-logos/generic-dark.svg';
        }
      }

      if (theme === 'light') {
        if (key && this.routes[key]) {
          this.imgRoute = this.routes[key].light;
        } else {
          this.imgRoute = 'media/svg/card-logos/generic.svg';
        }
      }

      // Auto theme is missing, can't figure out how to handle it
    });
  }


  get sizeClass(): string {
    switch (this.size()) {
      case CardIconSize.Small:
        return 'small';
      case CardIconSize.Large:
        return 'large';
      case CardIconSize.Medium:
      default:
        return 'medium';
    }
  }
}
