import { Component, OnInit, AfterViewInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit, AfterViewInit {
  private readonly TOTAL_MS = 5000;     // total splash time
  private readonly FADE_OUT_MS = 400;   // must match CSS fade-out duration
  private readonly VISIBLE_MS = this.TOTAL_MS - this.FADE_OUT_MS;

  isExiting = signal(false);

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('splashSeen')) {
      this.router.navigateByUrl('/home'); // skip on repeat visits
    }
  }

  ngAfterViewInit(): void {
    if (!localStorage.getItem('splashSeen')) {
      setTimeout(() => {
        this.isExiting.set(true); // start fade-out
        localStorage.setItem('splashSeen', 'true');
        setTimeout(() => this.router.navigateByUrl('/home'), this.FADE_OUT_MS);
      }, this.VISIBLE_MS);
    }
  }
}
