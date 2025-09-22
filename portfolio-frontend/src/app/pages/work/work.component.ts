import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

type Role = 'all' | 'fullstack' | 'devops' | 'scripts';

interface Project {
  id: string;
  title: string;
  oneLiner: string;
  roles: Role[];
  tags: string[];
  metrics?: string[];
  scope?: string;
  duration?: string;
  link?: string;
  isExternal?: boolean;
  blogLink?: string;
  videoLink?: string;
  n8n?: boolean; // optional automation badge
}

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule],
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css'],
})
export class WorkComponent {
  readonly filters = [
    { key: 'all' as Role,       label: 'All' },
    { key: 'fullstack' as Role, label: 'Web (Fullstack)' },
    { key: 'devops' as Role,    label: 'DevOps' },
    { key: 'scripts' as Role,   label: 'PowerShell Quick Fix' },
  ];

  active: Role = 'all';

  readonly projects: Project[] = [
    /** ===================== Fullstack ===================== */
    {
      id: 'fs1',
      title: 'SAFARICA – Tour Booking',
      oneLiner:
        'End-to-end booking with catalog, cart, Stripe payments/refunds, and automated emails after payment.',
      roles: ['fullstack'],
      tags: ['Angular', 'Node', 'Express', 'MongoDB', 'Stripe', 'Automation'],
      scope: 'Public app + admin panel',
      duration: '8 weeks',
      link: '/projects/safarica',
      n8n: true,
    },
    {
      id: 'fs2',
      title: 'BarberShop',
      oneLiner:
        'Appointments, staff management, and automated SMS confirmations.',
      roles: ['fullstack'],
      tags: ['Angular', 'Node', 'Express', 'MongoDB', 'Twilio'],
      scope: 'Booking + management platform',
      duration: '6 weeks',
      link: '/projects/barbershop',
    },
    {
      id: 'fs3',
      title: 'NutriTrack - Calories Counter',
      oneLiner:
        'Nutrition & exercise tracker with AI-based calorie estimation from food inputs.',
      roles: ['fullstack'],
      tags: ['Angular', 'Node', 'Express', 'MongoDB', 'AI'],
      scope: 'Health & fitness app',
      duration: '5 weeks',
      link: '/projects/calories-counter',
    },

    /** ===================== DevOps (one per app) ===================== */
    {
      id: 'do1',
      title: 'Safarica – DevOps Hosting',
      oneLiner:
        'Containerized deployment with CI/CD and monitoring. Video walkthrough included.',
      roles: ['devops'],
      tags: ['Docker', 'Kubernetes', 'Azure', 'CI/CD'],
      metrics: ['Zero downtime'],
      scope: 'App hosting',
      duration: '2 weeks',
      link: '/projects/devops-safarica',
      videoLink: 'https://your-video-url.example/devops-safarica',
    },
    {
      id: 'do2',
      title: 'BarberShop – DevOps Hosting',
      oneLiner:
        'Containerized deployment with CI/CD and monitoring. Video walkthrough included.',
      roles: ['devops'],
      tags: ['Docker', 'Kubernetes', 'Azure', 'CI/CD'],
      metrics: ['Scalable infra'],
      scope: 'App hosting',
      duration: '2 weeks',
      link: '/projects/devops-barbershop',
      videoLink: 'https://your-video-url.example/devops-barbershop',
    },
    {
      id: 'do3',
      title: 'Calories Counter – DevOps Hosting',
      oneLiner:
        'Containerized deployment with CI/CD and monitoring. Video walkthrough included.',
      roles: ['devops'],
      tags: ['Docker', 'Kubernetes', 'Azure', 'CI/CD'],
      metrics: ['Reliable builds'],
      scope: 'App hosting',
      duration: '2 weeks',
      link: '/projects/devops-calories',
      videoLink: 'https://your-video-url.example/devops-calories',
    },

    /** ===================== PowerShell Quick Fix ===================== */
    {
      id: 'ps1',
      title: 'Armoury Crate Repair Script',
      oneLiner:
        'PowerShell script to fix common Armoury Crate issues on ASUS ROG PCs.',
      roles: ['scripts'],
      tags: ['PowerShell', 'Windows', 'ASUS ROG', 'Troubleshooting'],
      scope: 'Quick fix script',
      duration: '1 week',
      link: '/projects/armoury-crate-fix',
    },
  ];

  get filtered(): Project[] {
    return this.active === 'all'
      ? this.projects
      : this.projects.filter((p) => p.roles.includes(this.active));
  }

  setActive(key: Role) {
    this.active = key;
  }

  trackById = (_: number, p: Project) => p.id;

  isscripts(p: Project): boolean {
    return p.roles.includes('scripts');
  }

  getPrimaryLink(p: Project): string | null {
    return p.link || p.blogLink || null;
  }
}
