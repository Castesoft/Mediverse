import { Component, DestroyRef, effect, inject, OnDestroy } from "@angular/core";
import BaseRouteDetail from "src/app/_models/base/components/extensions/routes/baseRouteDetail";
import { Product } from 'src/app/_models/products/product';
import { FormUse } from "src/app/_models/forms/formTypes";
import { takeUntil } from "rxjs/operators";
import { Navigation, ParamMap } from "@angular/router";
import { Subject } from "rxjs";
import { SiteSection } from "src/app/_models/sections/sectionTypes";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: 'div[adminProductDetailRoute]',
  template: `
    <div breadcrumbs>
      <button
        class="btn bg-body btn-color-gray-700 btn-active-primary align-items-center d-flex me-4"
      >
        <i class="ki-duotone ki-pencil">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        Editar
      </button>
    </div>
    <div post>
      <div productForm
           [(use)]="use"
           [(view)]="view"
           [(item)]="item"
           [(key)]="key"
           [siteSection]="SiteSection.ADMIN"></div>
    </div>
  `,
  standalone: false,
})
export class AdminProductDetailRouteComponent extends BaseRouteDetail<Product> implements OnDestroy {
  protected readonly SiteSection: typeof SiteSection = SiteSection;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
    super('products', FormUse.DETAIL);
    this.key.set(`${this.router.url}#order-edit`);

    effect(() => {
      this.subscribeToParamMap();
      this.subscribeToRouteData();
      this.setKey();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private subscribeToParamMap() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (params: ParamMap) => {
        if (params.has('id')) this.id.set(+params.get('id')!);
      },
    });
  }

  private subscribeToRouteData() {
    this.route.data.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.item.set(data['item']);
      },
    });
  }

  private setKey() {
    const navigation: Navigation | null = this.router.getCurrentNavigation();
    if (navigation !== null) {
      this.key.set(navigation?.extras?.state?.['key'] || null);
    }
  }
}
