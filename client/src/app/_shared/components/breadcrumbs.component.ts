import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { BreadcrumbComponent } from "src/app/_shared/template/components/breadcrumbs/breadcrumb.component";
import { BreadcrumbLinkComponent } from "src/app/_shared/template/components/breadcrumbs/breadcrumb-link.component";
import { ToolbarActionsComponent } from "src/app/_shared/template/components/toolbars/toolbar-actions.component";
import { ToolbarComponent } from "src/app/_shared/template/components/toolbars/toolbar.component";
import { ToolbarContainerComponent } from "src/app/_shared/template/components/toolbars/toolbar-container.component";
import { ToolbarInfoComponent } from "src/app/_shared/template/components/toolbars/toolbar-info.component";
import { ToolbarTitleComponent } from "src/app/_shared/template/components/toolbars/toolbar-title.component";
import { BreadcrumbItem, BreadcrumbService } from "src/app/_models/services/breadcrumb.service";
import { ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "div[breadcrumbs]",
  templateUrl: "./breadcrumbs.component.html",
  standalone: true,
  imports: [
    BreadcrumbComponent,
    BreadcrumbLinkComponent,
    ToolbarActionsComponent,
    ToolbarComponent,
    ToolbarContainerComponent,
    ToolbarInfoComponent,
    ToolbarTitleComponent
  ],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  private route = inject(ActivatedRoute);

  breadcrumbsService: BreadcrumbService = inject(BreadcrumbService);
  breadcrumbs: BreadcrumbItem[] = []

  title: string | undefined;

  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data): void => {
        if (data['title']) {
          this.title = data['title'];
        }

        if (data['breadcrumb']) {
          this.breadcrumbs = [
            { label: 'Inicio', url: '/' },
            { label: data['breadcrumb'] },
          ];
          this.breadcrumbsService.setBreadcrumbItems(this.breadcrumbs);
        } else {
          this.breadcrumbs = [
            { label: 'Inicio', url: '/' },
            { label: 'Cuenta', url: '/cuenta' },
          ];
          this.breadcrumbsService.setBreadcrumbItems(this.breadcrumbs);
        }
      },
    });

    this.breadcrumbsService.breadcrumbItems$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
