import { Component, ElementRef, HostListener, input, OnInit, output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  standalone: true,
  imports: [],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss'
})
export class NavMenuComponent implements OnInit {
  currentSection = input.required<string>();
  onSelectSection = output<string>();
  
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
