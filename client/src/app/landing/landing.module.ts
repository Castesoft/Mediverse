import { NgModule } from "@angular/core";
import { LandingServicesRouteComponent } from "src/app/landing/routes/services/landing-services-route.component";
import { CommonModule } from "@angular/common";
import { LandingRoutingModule } from "src/app/landing/landing-routing.module";
import { LayoutModule } from "@angular/cdk/layout";

@NgModule({
  declarations: [
    LandingServicesRouteComponent,
  ],
  imports: [ CommonModule, LandingRoutingModule, LayoutModule ],
})
export class LandingModule {}
