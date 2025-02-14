import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BootstrapModule } from 'src/app/_shared/bootstrap.module';
import { CdkModule } from 'src/app/_shared/cdk.module';
import { TemplateModule } from 'src/app/_shared/template/template.module';
import { AccountCardComponent } from 'src/app/account/components/account-card.component';
import { MainAsideComponent } from 'src/app/_shared/template/components/main-aside.component';
import { AccountComponent } from "src/app/account/account.component";
import { AccountRoutingModule } from "src/app/account/account-routing.module";

@NgModule({
  declarations: [ AccountComponent ],
  imports: [
    CommonModule,
    RouterModule,
    AccountRoutingModule,
    BootstrapModule,
    CdkModule,
    TemplateModule,
    AccountCardComponent,
    MainAsideComponent
  ]
})
export class AccountModule {}
