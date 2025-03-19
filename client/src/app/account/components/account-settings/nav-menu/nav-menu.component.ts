import {
  Component,
  ElementRef,
  HostListener,
  input,
  InputSignal,
  OnInit,
  output,
  OutputEmitterRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent implements OnInit {
  currentSection: InputSignal<string> = input.required<string>();
  onSelectSection: OutputEmitterRef<string> = output<string>();

  @ViewChild('stickyRef', { static: true }) stickyRef!: ElementRef;
  isSticky: boolean = false;
  startingOffset: number = 0;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky = window.pageYOffset > this.startingOffset;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.startingOffset = this.stickyRef.nativeElement.offsetTop + 20;
    }, 100);
  }

  selectSection(section: string) {
    this.onSelectSection.emit(section);
  }
}
