import { Component, ElementRef } from '@angular/core';

declare var KTDrawer: any;

@Component({
  host: {
    class: 'aside aside-default aside-hoverable',
    id: 'kt_aside',
    'data-kt-drawer': 'true',
    'data-kt-drawer-name': 'aside',
    'data-kt-drawer-activate': '{ default: true, lg: false}',
    'data-kt-drawer-overlay': 'true',
    'data-kt-drawer-width': "default: '200px', '300px': '250px'",
    'data-kt-drawer-direction': 'start',
    'data-kt-drawer-toggle': '#kt_aside_toggle',
    style: '',
  },
  selector: '[drawer]',
  templateUrl: './drawer.component.html',
})
export class DrawerComponent {

  constructor(private el: ElementRef) {
    // const element = this.el.nativeElement;

    // const drawer = new KTDrawer(element, {
    //   overlay: true,
    //   direction: 'end'
    // });

    // console.log('drawer', drawer);

    // drawer.init();

  }

}
