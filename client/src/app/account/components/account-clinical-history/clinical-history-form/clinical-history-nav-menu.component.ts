import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  input,
  InputSignal, OnInit,
  output,
  OutputEmitterRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-clinical-history-nav-menu',
  standalone: true,
  templateUrl: './clinical-history-nav-menu.component.html',
  styleUrl: './clinical-history-nav-menu.component.scss'
})
export class ClinicalHistoryNavMenuComponent implements OnInit {
  currentSection: InputSignal<string> = input.required();
  onSelectSection: OutputEmitterRef<string> = output();

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
