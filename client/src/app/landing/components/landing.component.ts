import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingNavbarComponent } from "src/app/landing/components/landing-navbar/landing-navbar.component";
import { LandingFooterComponent } from "src/app/landing/components/landing-footer/landing-footer.component";
import { LandingCardComponent } from "src/app/landing/components/landing-card/landing-card.component";
import { LandingTestimonySlide } from "src/app/landing/components/landing-testimony-card/landingTestimonySlide";
import { Carousel } from "primeng/carousel";
import {
  LandingTestimonyCardComponent
} from "src/app/landing/components/landing-testimony-card/landing-testimony-card.component";
import { ButtonProps } from "primeng/button";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: [ './landing.component.scss' ],
  imports: [
    CommonModule,
    LandingNavbarComponent,
    LandingFooterComponent,
    LandingCardComponent,
    Carousel,
    LandingTestimonyCardComponent,
  ],
})
export class LandingComponent {
  responsiveOptions: any[] | undefined = [
    {
      breakpoint: '1400px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '1199px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '767px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '575px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  carouselButtonProps: ButtonProps = {}

  slides: LandingTestimonySlide[] = [
    {
      index: 0,
      name: "Alice Smith",
      body: "DocHub transformó mi práctica: menos papeleo, más tiempo para mis pacientes."
    },
    {
      index: 1,
      name: "Bob Johnson",
      body: "La farmacia virtual es revolucionaria. Recetas al instante y sin complicaciones."
    },
    {
      index: 2,
      name: "Charlie Brown",
      body: "Centralizar la información del paciente nunca fue tan fácil y eficiente."
    },
    {
      index: 3,
      name: "Diana Prince",
      body: "Las solicitudes automáticas de reembolso son un salvavidas administrativo."
    },
    {
      index: 4,
      name: "Ethan Hunt",
      body: "La interfaz de DocHub es tan intuitiva que me sentí experto desde el primer día."
    },
    {
      index: 5,
      name: "Fiona Gallagher",
      body: "Tener todos mis datos en un solo lugar me da tranquilidad y control absoluto."
    },
    {
      index: 6, name: "George Martin",
      body: "El soporte de DocHub es inmejorable. Siempre responden rápido y con la mejor actitud."
    },
    {
      index: 7, name: "Hannah Baker",
      body: "Agendar citas es muy flexible. Puedo adaptarme fácilmente a la vida de mis pacientes."
    },
    {
      index: 8,
      name: "Ian Malcolm",
      body: "Registros siempre actualizados: tomar decisiones médicas nunca fue tan seguro."
    },
    {
      index: 9,
      name: "Jane Doe",
      body: "La seguridad de la plataforma me hace sentir en buenas manos."
    },
  ];
}
