import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  HostListener,
  NgZone,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  RouterModule,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('navLink') navLinks!: QueryList<ElementRef<HTMLAnchorElement>>;
  @ViewChild('linkContainer') linkContainer!: ElementRef<HTMLElement>;
  @ViewChild('navRoot') navRoot!: ElementRef<HTMLElement>;

  // Traveling underline
  sliderTransform = 'translate3d(0,0,0) scaleX(1)';
  ready = false;

  // Mobile
  menuOpen = false;

  // Readability behavior
  inverted = false;   // true when overlapping a dark section
  scrolled  = false;  // adds shadow when not at very top
  navBg = 'rgba(255,255,255,0)';

  // Tuning
  private baseAlphaLight = 0.85; // white alpha over light sections
  private baseAlphaDark  = 0.60; // dark alpha over dark sections
  private fadeInDist = 64;       // px to ramp in at page top

  // Housekeeping
  private onScrollRef = () => this.onScroll();
  private subs = new Subscription();

  constructor(private router: Router, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    // Initial underline placement after view is stable
    const stableSub = this.ngZone.onStable.subscribe(() => this.placeUnderline(true));
    this.subs.add(stableSub);

    // Move underline on route changes
    const routerSub = this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError
        )
      )
      .subscribe(() => this.placeUnderline());
    this.subs.add(routerSub);

    // When the list of links changes (e.g., responsive conditions)
    const linksSub = this.navLinks.changes.subscribe(() => this.placeUnderline());
    this.subs.add(linksSub);

    // After fonts load (widths may change)
    const anyDoc: any = document;
    if (anyDoc.fonts && typeof anyDoc.fonts.ready?.then === 'function') {
      anyDoc.fonts.ready.then(() => this.placeUnderline());
    }

    // Scroll handling outside Angular for performance
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.onScrollRef, { passive: true });
    });

    // Compute initial state
    const y = window.scrollY || 0;
    this.updateScrolled(y);
    this.updateInversionByProbe();
    this.updateBackground(y);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScrollRef);
    this.subs.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.placeUnderline();
    this.updateInversionByProbe();      // layout changed, re-probe
    this.updateBackground(window.scrollY || 0);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  // Keep your Tailwind classes for links here
  baseLinkClasses: string[] = [
    // color is controlled by CSS variables in the nav (see CSS)
    'font-bold',
    'font-poppins',
    'transition-colors',
    'duration-200',
    'ease-out',
    'relative',
  ];

  // ===== Scroll logic =====
  private onScroll(): void {
    const y = window.scrollY || 0;
    // Back into Angular for state updates
    this.ngZone.run(() => {
      this.updateScrolled(y);
      this.updateInversionByProbe();
      this.updateBackground(y);
    });
  }

  private updateScrolled(y: number): void {
    this.scrolled = y > 0;
  }

  /** Probe the element under the navbar centerline and find a data-theme on it or its ancestors */
  private updateInversionByProbe(): void {
    const navEl = this.navRoot?.nativeElement;
    const probeY = Math.max((navEl?.offsetHeight ?? 64) - 1, 0);
    const centerX = Math.floor(window.innerWidth / 2);

    const el = document.elementFromPoint(centerX, probeY) as HTMLElement | null;
    let node: HTMLElement | null = el;
    let theme: 'light' | 'dark' = 'light';
    let steps = 0;

    while (node && steps++ < 24) {
      const dt = node.dataset ? node.dataset['theme'] : undefined;
      if (dt === 'dark' || dt === 'light') {
        theme = dt;
        break;
      }
      node = node.parentElement;
    }

    this.inverted = theme === 'dark';
  }

  private updateBackground(y: number): void {
    const base = this.inverted ? this.baseAlphaDark : this.baseAlphaLight;
    const ramp = Math.min(Math.max(y / this.fadeInDist, 0), 1); // 0→1 over first N px
    const a = +(base * ramp).toFixed(3);

    this.navBg = this.inverted
      ? `rgba(15, 23, 42, ${a})`   // slate-900-ish
      : `rgba(255, 255, 255, ${a})`;
  }

  // ===== Underline logic =====
  private placeUnderline(initial = false): void {
    const links = this.navLinks?.toArray().map((r) => r.nativeElement) ?? [];
    const container = this.linkContainer?.nativeElement;
    if (!links.length || !container) return;

    const active =
      links.find((a) => a.classList.contains('router-link-active')) ?? links[0];
    if (!active) return;

    const a = active.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    const left = Math.round(a.left - c.left);
    const width = Math.round(a.width);

    this.sliderTransform = `translate3d(${left}px,0,0) scaleX(${width})`;

    if (initial && !this.ready) {
      requestAnimationFrame(() => (this.ready = true));
    }
  }
}
