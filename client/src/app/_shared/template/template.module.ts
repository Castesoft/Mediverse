import { NgModule } from "@angular/core";
import { NotificationsDropdownComponent } from './components/notifications-dropdown.component';
import { QuickLinksDropdownComponent } from './components/quick-links-dropdown.component';
import { ScrolltopComponent } from './components/scrolltop.component';
import { ThemeDropdownComponent } from './components/theme-dropdown.component';
import { UserDropdownComponent } from './components/user-dropdown.component';
import { CatalogCardHeaderComponent } from "src/app/_shared/template/components/catalog-card-header.component";
import { ContentComponent } from "src/app/_shared/template/components/content.component";
import { FooterComponent } from "src/app/_shared/template/components/footer.component";
import { FormWrapperComponent } from "src/app/_shared/template/components/form-wrapper.component";
import { OnlineBadgeComponent } from "src/app/_shared/template/components/online-badge.component";
import { PageComponent } from "src/app/_shared/template/components/page.component";
import { PostComponent } from "src/app/_shared/template/components/post.component";
import { RootComponent } from "src/app/_shared/template/components/root.component";
import { WrapperComponent } from "src/app/_shared/template/components/wrapper.component";
import { AuthAsideComponent } from './components/auth-aside.component';
import { BreadcrumbsModule } from "src/app/_shared/template/components/breadcrumbs/breadcrumbs.module";
import { ButtonsModule } from "src/app/_shared/template/components/buttons/buttons.module";
import { CardsModule } from "src/app/_shared/template/components/cards/cards.module";
import { HeadersModule } from "src/app/_shared/template/components/headers/headers.module";
import { ToolbarsModule } from "src/app/_shared/template/components/toolbars/toolbars.module";
import { SymbolsModule } from "src/app/_shared/template/components/symbols/symbols.module";
import { TablesModule } from "src/app/_shared/template/components/tables/tables.module";

@NgModule({
  imports: [
    BreadcrumbsModule,
    ButtonsModule,
    CardsModule,
    HeadersModule,
    ToolbarsModule,
    SymbolsModule,
    TablesModule,

    ContentComponent,
    PostComponent,
    OnlineBadgeComponent,
    WrapperComponent,
    RootComponent,
    PageComponent,
    FooterComponent,
    AuthAsideComponent,
    NotificationsDropdownComponent,
    QuickLinksDropdownComponent,
    ScrolltopComponent,
    ThemeDropdownComponent,
    UserDropdownComponent,
    CatalogCardHeaderComponent,
    FormWrapperComponent,
  ],
  exports: [
    BreadcrumbsModule,
    ButtonsModule,
    CardsModule,
    HeadersModule,
    ToolbarsModule,
    SymbolsModule,
    TablesModule,

    CatalogCardHeaderComponent,
    ContentComponent,
    FooterComponent,
    FormWrapperComponent,
    OnlineBadgeComponent,
    PageComponent,
    PostComponent,
    RootComponent,
    WrapperComponent,

    AuthAsideComponent,
    NotificationsDropdownComponent,
    QuickLinksDropdownComponent,
    ScrolltopComponent,
    ThemeDropdownComponent,
    UserDropdownComponent,
  ],
})
export class TemplateModule { }
