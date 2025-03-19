import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import { BreadcrumbComponent } from "src/app/_shared/template/components/breadcrumbs/breadcrumb.component";
import { BreadcrumbLinkComponent } from "src/app/_shared/template/components/breadcrumbs/breadcrumb-link.component";
import { BreadcrumbItem, BreadcrumbService } from "src/app/_models/services/breadcrumb.service";
import { ActivatedRoute } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "div[breadcrumbs]",
  templateUrl: "./breadcrumbs.component.html",
  standalone: true,
  imports: [
    BreadcrumbComponent,
    BreadcrumbLinkComponent,
  ],
})
export class BreadcrumbsComponent implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private route: ActivatedRoute = inject(ActivatedRoute);

  breadcrumbsService: BreadcrumbService = inject(BreadcrumbService);
  breadcrumbs: BreadcrumbItem[] = []

  title: string | undefined;

  /**
   * Initializes the component by setting up breadcrumbs and title based on route data.
   * Also subscribes to breadcrumb updates from the BreadcrumbService.
   *
   * This method performs the following tasks:
   * 1. Subscribes to route data to set the title and breadcrumbs.
   * 2. Processes breadcrumb data from the route, supporting both string and array formats.
   * 3. Sets default breadcrumbs if no specific breadcrumb data is provided.
   * 4. Updates the BreadcrumbService with the new breadcrumb items.
   * 5. Subscribes to the BreadcrumbService to keep the local breadcrumbs array updated.
   *
   * @returns {void}
   */
  ngOnInit(): void {
    this.route.data.subscribe({
      next: (data): void => {
        if (data['title']) {
          this.title = data['title'];
        }

        if (data['breadcrumb']) {
          let crumbs: string[] = [];

          if (typeof data['breadcrumb'] === 'string') {
            crumbs = [ data['breadcrumb'] ];
          } else if (Array.isArray(data['breadcrumb'])) {
            crumbs = data['breadcrumb'];
          }

          this.breadcrumbs = [
            { label: 'Inicio', url: '/' },
            ...crumbs.map((crumb, index) => ({
              label: crumb,
              url: index === crumbs.length - 1 ? undefined : '../'.repeat(crumbs.length - index - 1)
            })),
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

    this.breadcrumbsService.breadcrumbItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((breadcrumbs) => {
      this.breadcrumbs = breadcrumbs;
    });
  }
}
