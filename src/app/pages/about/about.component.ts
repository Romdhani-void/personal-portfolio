import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

interface StackGroup {
  title: string;
  items: string[];
  fallbackIcon: string;
}

interface Language {
  name: string;
  level: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  name = 'Romdhani, Mohamed Ali';
  pronouns = 'he/him';
  title = 'Subject Matter Expert - French client';
  gradYear = 2025;
  location = 'Hungary';
  currentEmployer = 'Tata Consultancy Services';
  linkedin = 'romdhani';

  careerGoal = 'Targeting AWS DevOps Engineer';

  languages: Language[] = [
    { name: 'English', level: 'IELTS 7' },
    { name: 'French', level: 'TCF C1' },
  ];

  stackGroups: StackGroup[] = [
    { title: 'Web Dev', items: ['Angular', 'TypeScript', 'Node.js', 'MongoDB'], fallbackIcon: '⚙️' },
    { title: 'DevOps', items: ['Docker', 'GitHub Actions', 'Jenkins', 'Terraform', 'Kubernetes', 'Helm', 'Grafana'], fallbackIcon: '⚙️' },
    { title: 'Cloud Provider', items: ['AWS'], fallbackIcon: '☁️' },
  ];

  // Simple Icons slugs — rendered in the accent color.
  private stackIconSlugs: Record<string, string> = {
    'Angular': 'angular',
    'TypeScript': 'typescript',
    'Node.js': 'nodedotjs',
    'MongoDB': 'mongodb',
    'Docker': 'docker',
    'GitHub Actions': 'githubactions',
    'Jenkins': 'jenkins',
    'Terraform': 'terraform',
    'Kubernetes': 'kubernetes',
    'Helm': 'helm',
    'Grafana': 'grafana',
  };

  // AWS has no official mark in Simple Icons (request was rejected upstream),
  // so it's served from Devicon's verified asset instead.
  private readonly awsIconUrl =
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg';

  get localTime(): string {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Budapest',
    }).format(new Date());
  }

  iconUrl(item: string): string | null {
    if (item === 'AWS') return this.awsIconUrl;
    const slug = this.stackIconSlugs[item];
    return slug ? `https://cdn.simpleicons.org/${slug}/1e3a8a` : null;
  }
}