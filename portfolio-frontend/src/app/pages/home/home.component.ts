import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterLink } from '@angular/router';

declare const VANTA: any;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('vantaRef', { static: true }) vantaRef!: ElementRef<HTMLElement>;
  private vantaEffect: any;

  bulletPoints: string[] = [
    '• System Administrator (Current: Subject Matter Expert) → securing and optimizing infrastructure.',
    '• Full Stack Developer → building scalable, user-focused applications.',
    '• DevSecOps → automating delivery for speed and reliability.'
  ];

  displayedText = '';
  private typingInterval: any;
  private currentBullet = 0;
  private currentChar = 0;

  ngAfterViewInit(): void {
    if (!VANTA || !VANTA.BIRDS || !this.vantaRef?.nativeElement) {
      console.warn('[VANTA] BIRDS not available or element missing.');
    } else {
      this.vantaEffect = VANTA.BIRDS({
        el: this.vantaRef.nativeElement,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1.0,
        scaleMobile: 1.0,
        backgroundColor: 0xF8FAFC,
        color1: 0x808080,
        color2: 0x0,
        wingSpan: 30,
        speedLimit: 2.0,
        quantity: 2
      });
    }

    this.typeNextCharacter();
  }

  typeNextCharacter(): void {
    if (this.currentBullet < this.bulletPoints.length) {
      const currentText = this.bulletPoints[this.currentBullet];
      if (this.currentChar < currentText.length) {
        this.displayedText += currentText.charAt(this.currentChar);
        this.currentChar++;
        this.typingInterval = setTimeout(() => this.typeNextCharacter(), 30);
      } else {
        this.displayedText += '\n';
        this.currentBullet++;
        this.currentChar = 0;
        this.typingInterval = setTimeout(() => this.typeNextCharacter(), 300);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.vantaEffect && typeof this.vantaEffect.destroy === 'function') {
      this.vantaEffect.destroy();
    }
    clearTimeout(this.typingInterval);
  }
}
