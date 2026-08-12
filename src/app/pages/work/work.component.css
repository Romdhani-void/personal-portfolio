import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { TechIconComponent, TechIconName } from '../../shared/tech-icon/tech-icon.component';

type Role = 'all' | 'fullstack' | 'devops' | 'scripts';

interface Project {
  id: string;
  title: string;
  oneLiner: string;
  roles: Role[];
  tags: string[];
  techIcons?: TechIconName[];
  metrics?: string[];
  scope?: string;
  duration?: string;
  link?: string;
  isExternal?: boolean;
  blogLink?: string;
  videoLink?: string;
  n8n?: boolean; // optional automation badge
  isWip?: boolean; // work in progress flag
  wipMessage?: string; // text shown in the "still on my desk" modal
}

@Component({
  selector: 'app-work',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterModule, TechIconComponent],
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
  showWipModal = false;
  selectedWipProject: Project | null = null;

  readonly projects: Project[] = [
    {
      id: 'fs1',
      title: 'SAFARICA – Tour Booking',
      oneLiner: 'End-to-end booking with catalog, cart, Stripe payments/refunds, and automated emails after payment.',
      roles: ['fullstack'],
      tags: ['Angular', 'Node', 'Express', 'MongoDB', 'Stripe'],
      scope: 'Public app + admin panel',
      duration: '8 weeks',
      link: 'https://github.com/Romdhani-void/safarica-app',
      isExternal: true
    },
    {
      id: 'fs2',
      title: 'BarberShop - Booking platform',
      oneLiner: 'Appointments, staff management, and automated SMS confirmations.',
      roles: ['fullstack'],
      tags: ['Angular', 'Node', 'Express', 'MongoDB'],
      scope: 'Booking + management platform',
      duration: 'Building as a SaaS',
      link: 'https://github.com/Romdhani-void/barbershop-booking',
      isExternal: true,
      isWip: true,
      wipMessage: 'BarberShop is being rebuilt as a multi-tenant SaaS platform, so any salon can sign up and run their own booking site. Check back soon for the full release.'
    },
    {
      id: 'fs3',
      title: 'NutriTracker - Calories Counter',
      oneLiner: 'Nutrition & exercise tracker with AI-based calorie estimation from food inputs.',
      roles: ['fullstack'],
      tags: ['Angular', 'Node', 'Express', 'MongoDB'],
      scope: 'Health & fitness app',
      duration: '5 weeks',
      link: 'https://github.com/Romdhani-void/NutriTracker',
      isExternal: true
    },
    {
      id: 'fs4',
      title: 'Artevier - Glazed Ceramics',
      oneLiner: 'Web project showcasing glazed ceramics craftsmanship.',
      roles: ['fullstack'],
      tags: ['Angular'],
      scope: 'Portfolio / showcase site',
      link: 'https://github.com/Romdhani-void/Artevier',
      isExternal: true
    },
    {
      id: 'do3',
      title: 'NutriTracker - DevOps Hosting',
      oneLiner: 'Containerized deployment with CI/CD and monitoring. Video walkthrough included.',
      roles: ['devops'],
      tags: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'CI/CD', 'Helm'],
      techIcons: ['docker', 'kubernetes', 'terraform', 'aws', 'cicd', 'Helm'],
      metrics: ['Reliable builds'],
      scope: 'App hosting',
      duration: '2 weeks',
      link: '/work/devops-nutritracker',
      videoLink: '/work/devops-nutritracker'
    },
    {
      id: 'do5',
      title: 'Artevier - DevOps Hosting',
      oneLiner: 'Containerized deployment on AWS EKS with a Jenkins CI/CD pipeline and monitoring.',
      roles: ['devops'],
      tags: ['Docker', 'Kubernetes', 'Terraform', 'AWS', 'Jenkins', 'Helm'],
      techIcons: ['docker', 'kubernetes', 'terraform', 'aws', 'jenkins', 'Helm'],
      metrics: ['Reliable builds'],
      scope: 'App hosting',
      link: '/work/devops-artevier',
      videoLink: '/work/devops-artevier'
    },
    {
      id: 'grapheme',
      title: 'Graph Me - VS Extension',
      oneLiner: 'VS Code extension that reads your YAML, graphs your infrastructure, watches live resources, surfaces issues in the graph, and suggests fixes. Still on my desk — active development.',
      roles: ['devops'],
      tags: ['TypeScript', 'VS Code Extension', 'Graph Visualization'],
      scope: 'Developer tooling / infra visualization',
      link: '#',
      isExternal: false
    },
    {
      id: 'ps1',
      title: 'Armoury Crate Repair Script',
      oneLiner: 'PowerShell script to fix common Armoury Crate issues on ASUS ROG PCs.',
      roles: ['scripts'],
      tags: ['PowerShell', 'Windows', 'ASUS ROG', 'Troubleshooting'],
      scope: 'Quick fix script',
      duration: '1 week',
      link: 'https://github.com/Romdhani-void/crystal-clear-asus',
      isExternal: true
    },
  ];

  get filtered(): Project[] {
    return this.active === 'all'
      ? this.projects
      : this.projects.filter((p) => p.roles.includes(this.active));
  }

  setActive(key: Role) { this.active = key; }
  trackById = (_: number, p: Project) => p.id;
  isscripts(p: Project): boolean { return p.roles.includes('scripts'); }
  getPrimaryLink(p: Project): string | null { return p.link || p.blogLink || null; }

  openWipModal(p: Project) {
    this.selectedWipProject = p;
    this.showWipModal = true;
  }
  closeWipModal() {
    this.showWipModal = false;
    this.selectedWipProject = null;
  }
}