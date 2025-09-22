import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { DistanceBadgeComponent } from '../../shared/distance-badge/distance-badge.component';
import { GithubContribComponent } from '../../shared/github-contrib/github-contrib.component';

type Highlight = { label: string };
type Metric = { text: string };
type Timeline = { period: string; title: string; org?: string; blurb: string };

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, NavbarComponent, DistanceBadgeComponent, GithubContribComponent],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {
  // --- Hero content (edit as needed) ---
  tagline = 'Software Engineer · SME · DevOps-minded';
  bio = `I design and ship pragmatic systems—secure, observable, and easy to operate.
I move work from “manual & fragile” to “automated & reliable”.`;

  // Optional headshot (add your asset path or leave empty to hide)
  headshot = ''; // e.g. 'assets/dali.jpg'

  // --- Highlights ---
  highlights: Highlight[] = [
    { label: 'System Administration & hardening' },
    { label: 'Full-stack delivery (Angular · Node · MongoDB)' },
    { label: 'DevSecOps / CI/CD / Docker · Kubernetes · Azure' },
  ];

  // --- Metrics (examples) ---
  metrics: Metric[] = [
    { text: '99.9% uptime on small-business apps' },
    { text: '−35% build time via CI caching' },
    { text: 'Zero-downtime deploys' },
  ];

  // --- Skills (keep 10–16 max) ---
  skills = [
    'Angular', 'TypeScript', 'Node', 'Express', 'MongoDB',
    'Docker', 'Kubernetes', 'Azure', 'CI/CD', 'PowerShell',
    'Linux', 'Nginx', 'Terraform', 'GitHub Actions'
  ];

  // --- Timeline (edit with your real items) ---
  timeline: Timeline[] = [
    { period: '2024–Now', title: 'Subject Matter Expert (IT)', blurb: 'Stability, incident response, automation-first fixes.' },
    { period: '2022–2024', title: 'Full-stack Dev (Freelance)', blurb: 'Angular/Node apps with Stripe/Twilio integrations.' },
    { period: '2019–2022', title: 'IT Support → SysAdmin', blurb: 'From ticket queues to infra ownership.' },
  ];

  // Links
  cvUrl = ''; // e.g. '/assets/cv.pdf'
  linkedin = 'https://www.linkedin.com/in/romdhani-mohamed-ali-5389aa183/';
  github = 'https://github.com/romdhaniali';

  hasHeadshot() { return !!this.headshot; }
  hasCv() { return !!this.cvUrl; }
}
