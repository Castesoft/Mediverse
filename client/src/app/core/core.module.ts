import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { DrawerComponent } from './components/account/drawer.component';
import { HeaderComponent } from './components/account/header.component';
import { ScrolltopComponent } from './components/account/scrolltop.component';
import { ThemeDropdownComponent } from './components/account/theme-dropdown.component';
import { UserDropdownComponent } from './components/account/user-dropdown.component';
import { NotificationsDropdownComponent } from './components/account/notifications-dropdown.component';
import { QuickLinksDropdownComponent } from './components/account/quick-links-dropdown.component';
import { HeaderSearchComponent } from './components/account/header-search.component';
import { FormErrorModalComponent } from './services/form-error-modal.service';



@NgModule({
  declarations: [
    DrawerComponent,
    HeaderComponent,
    ScrolltopComponent,
    ThemeDropdownComponent,
    UserDropdownComponent,
    NotificationsDropdownComponent,
    QuickLinksDropdownComponent,
    HeaderSearchComponent,


    FormErrorModalComponent,
  ],
  imports: [
    CommonModule,

    SharedModule,
  ],
  exports: [
    DrawerComponent,
    HeaderComponent,
    ScrolltopComponent,
    ThemeDropdownComponent,
    UserDropdownComponent,
    NotificationsDropdownComponent,
    QuickLinksDropdownComponent,
    HeaderSearchComponent,


    FormErrorModalComponent,
  ]
})
export class CoreModule { }
