import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

type Flake = { x:number; y:number; r:number; vy:number; phi:number; wobble:number; alpha:number; };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('tiltCard',   { static: false }) tiltCard!: ElementRef<HTMLElement>;
  @ViewChild('snowCanvas', { static: true  }) snowCanvas!: ElementRef<HTMLCanvasElement>;

  // ====== Content / UI ======
  roles = ['DevOps Engineer', 'Subject Matter Expert', 'Full-Stack MEAN'];
  currentRole = this.roles[0];
  private roleIdx = 0;
  private roleTimer: any;

  lastDeployment = new Date().toLocaleDateString();
  pipeline = 'Build · Test · Deploy (main branch)';
  uptime = '99.98%';
  latency = '142 ms';
  statusSummary = 'Stable — auto-deploys on push';
  statusEmoji = '✅';
  get statusText() { return 'Healthy'; }
  get statusPillClass() {
    return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
  }

  // Tilt
  tilt = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';

  // ====== Snow (Blue “sky-300”) ======
  // Tailwind sky-300: rgb(125, 211, 252)
  private FLAKE_RGB = { r: 125, g: 211, b: 252 };
  // Optional: softer background glow for depth
  private GLOW_ALPHA = 0.08;

  private flakes: Flake[] = [];
  private ctx!: CanvasRenderingContext2D;
  private rafId: number | null = null;
  private onResize?: () => void;
  private reducedMotion = false;

  ngAfterViewInit(): void {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Role rotation
    this.startRoleRotation(this.reducedMotion ? 0 : 2000);

    // Snow init
    this.initSnowCanvas();
    this.seedFlakes();
    if (!this.reducedMotion) this.loopSnow(); else this.drawSnowOnce();

    const handleResize = () => {
      this.resizeSnowCanvas();
      this.seedFlakes();
      if (this.reducedMotion) this.drawSnowOnce();
    };
    window.addEventListener('resize', handleResize);
    this.onResize = () => window.removeEventListener('resize', handleResize);
  }

  ngOnDestroy(): void {
    clearInterval(this.roleTimer);
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
    this.onResize?.();
  }

  // ---- Role badge rotation ----
  private startRoleRotation(intervalMs: number) {
    if (!intervalMs) { this.currentRole = this.roles.join(' · '); return; }
    this.roleTimer = setInterval(() => {
      this.roleIdx = (this.roleIdx + 1) % this.roles.length;
      this.currentRole = this.roles[this.roleIdx];
    }, intervalMs);
  }

  // ---- Tilt card ----
  onTilt(e: MouseEvent) {
    const el = this.tiltCard?.nativeElement;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 12;
    const rotateX = (0.5 - y) * 12;
    this.tilt = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }
  resetTilt() { this.tilt = 'perspective(1200px) rotateX(0deg) rotateY(0deg)'; }

  // ---- Snow engine ----
  private initSnowCanvas() {
    const c = this.snowCanvas.nativeElement;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    c.width  = Math.floor(c.clientWidth  * dpr);
    c.height = Math.floor(c.clientHeight * dpr);
    this.ctx = c.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.scale(dpr, dpr);
  }

  private resizeSnowCanvas() {
    const c = this.snowCanvas.nativeElement;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    c.width  = Math.floor(c.clientWidth  * dpr);
    c.height = Math.floor(c.clientHeight * dpr);
    this.ctx.setTransform(1,0,0,1,0,0);
    this.ctx.scale(dpr, dpr);
  }

  private seedFlakes() {
    const c = this.snowCanvas.nativeElement;
    const w = c.clientWidth, h = c.clientHeight;
    const density = this.reducedMotion ? 0.00005 : 0.0001; // flakes per px²
    const count = Math.max(50, Math.floor(w * h * density));
    this.flakes = Array.from({ length: count }, () => this.makeFlake(w, h));
  }

  private makeFlake(w:number, h:number): Flake {
    const r   = this.rand(1.0, 2.6);
    const vy  = this.rand(20, 55) / 60;     // px per frame
    const phi = Math.random() * Math.PI * 2;
    const wob = this.rand(0.008, 0.024);
    const a   = this.rand(0.55, 0.95);
    return { x: Math.random()*w, y: Math.random()*h, r, vy, phi, wobble:wob, alpha:a };
  }

  private loopSnow = () => { this.rafId = requestAnimationFrame(this.loopSnow); this.stepSnow(); this.drawSnow(); };

  private stepSnow() {
    const c = this.snowCanvas.nativeElement;
    const w = c.clientWidth, h = c.clientHeight;
    for (const f of this.flakes) {
      f.y += f.vy;
      f.phi += f.wobble;
      f.x += Math.sin(f.phi) * 0.3;
      if (f.y - f.r > h) { f.y = -f.r; f.x = Math.random()*w; }
      if (f.x < -8) f.x = w + 8;
      if (f.x > w + 8) f.x = -8;
    }
  }

  private drawSnow() {
    const c = this.snowCanvas.nativeElement;
    const w = c.clientWidth, h = c.clientHeight;
    this.ctx.clearRect(0,0,w,h);

    // soft blue glow depth (few big, faint circles)
    for (let i=0; i<Math.min(6, this.flakes.length); i++) {
      const f = this.flakes[i];
      this.ctx.fillStyle = `rgba(${this.FLAKE_RGB.r}, ${this.FLAKE_RGB.g}, ${this.FLAKE_RGB.b}, ${this.GLOW_ALPHA})`;
      this.ctx.beginPath(); this.ctx.arc(f.x, f.y, f.r*4, 0, Math.PI*2); this.ctx.fill();
    }

    // blue flakes
    for (const f of this.flakes) {
      this.ctx.fillStyle = `rgba(${this.FLAKE_RGB.r}, ${this.FLAKE_RGB.g}, ${this.FLAKE_RGB.b}, ${f.alpha})`;
      this.ctx.beginPath(); this.ctx.arc(f.x, f.y, f.r, 0, Math.PI*2); this.ctx.fill();
    }
  }

  private drawSnowOnce() { this.stepSnow(); this.drawSnow(); }

  private rand(min:number,max:number){ return Math.random()*(max-min)+min; }
}
