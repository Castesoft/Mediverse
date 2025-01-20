import { Component, effect, OnDestroy } from "@angular/core";
import BaseRouteDetail from "src/app/_models/base/components/extensions/routes/baseRouteDetail";
import { FormUse } from "src/app/_models/forms/formTypes";
import Event from "src/app/_models/events/event";
import { takeUntil } from "rxjs/operators";
import { Navigation, ParamMap } from "@angular/router";
import { Subject } from "rxjs";

@Component({
  selector: 'div[homeEventDetailRoute]',
  template: `
    <div breadcrumbs></div>
    <div post>
      <div eventDetail [(use)]="use" [(view)]="view" [(item)]="item" [(key)]="key" [(title)]="title"></div>
    </div>
  `,
  standalone: false,
})
export class HomeEventDetailRouteComponent extends BaseRouteDetail<Event> implements OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() {
    super('events', FormUse.DETAIL);

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
    this.route.paramMap.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (params: ParamMap) => {
        if (params.has('id')) this.id.set(+params.get('id')!);
      },
    });
  }

  private subscribeToRouteData() {
    this.route.data.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
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
