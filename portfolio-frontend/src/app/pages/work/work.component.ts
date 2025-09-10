import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { RouterModule } from '@angular/router';

type Role = 'all' | 'sysadmin' | 'fullstack' | 'devsecops' | 'api';

interface Project {
  id: string;
  title: string;
  oneLiner: string;
  roles: Role[];
  tags: string[];
  metrics?: string[];
  scope?: string;
  duration?: string;
  link?: string;         // preferred destination (case study / demo / project page)
  isExternal?: boolean;  // true to open in a new tab
  blogLink?: string;     // optional fallback
  n8n?: boolean;         // renders minimal n8n corner ribbon
  n8nLink?: string;      // optional doc link (not used in UI here)
  videoLink?: string;    // if present => only "Watch Video" is shown
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
    { key: 'sysadmin' as Role,  label: 'System Administration' },
    { key: 'fullstack' as Role, label: 'Web' },
    { key: 'devsecops' as Role, label: 'DevSecOps' },
    { key: 'api' as Role,       label: 'API' },
  ];

  active: Role = 'all';

  readonly projects: Project[] = [
    /** ===================== System Administration (3) ===================== */
    {
      id: 'sa1',
      title: 'NetCore Enterprise',
      oneLiner:
        'Hybrid AD + Entra ID with Intune compliance, BitLocker escrow, and automated app baselines for enterprise endpoints.',
      roles: ['sysadmin', 'api', 'devsecops'],
      tags: ['Entra ID', 'AD Connect', 'Intune', 'BitLocker', 'Win32 Apps'],
      metrics: ['Compliance 98%', 'Rollout time ↓ 55%'],
      scope: 'Identity, device, and app lifecycle',
      duration: '6 weeks',
      link: '/case-studies/netcore-enterprise',
      blogLink: '/blogs/netcore-enterprise',
      videoLink: 'https://your-video-url.example/netcore', // replace with real video
    },
    {
      id: 'sa2',
      title: 'AuthSphere AD',
      oneLiner:
        'Modernized on-prem AD: tiered admin model, fine-grained GPO, LAPS, and privileged access workstations.',
      roles: ['sysadmin'],
      tags: ['Active Directory', 'GPO', 'LAPS', 'PAW', 'RBAC'],
      metrics: ['P1 auth incidents: 0', 'Lateral movement risk ↓ 70%'],
      scope: 'Directory services hardening',
      duration: '4 weeks',
      link: '/case-studies/authsphere-ad',
      blogLink: '/blogs/authsphere-ad',
      videoLink: 'https://your-video-url.example/authsphere',
    },
    {
      id: 'sa3',
      title: 'CloudLink Manager',
      oneLiner:
        'Site-to-site VPN / vWAN design, Azure Firewall policies, and hardened landing zones with BCDR playbooks.',
      roles: ['sysadmin', 'devsecops'],
      tags: ['Azure', 'vWAN/VPN', 'Azure Firewall', 'BCDR', 'Landing Zone'],
      metrics: ['MTTR ↓ 31%', 'RPO ≤ 15 min'],
      scope: 'Network + cloud security architecture',
      duration: '5 weeks',
      link: '/case-studies/cloudlink-manager',
      blogLink: '/blogs/cloudlink-manager',
      videoLink: 'https://your-video-url.example/cloudlink',
    },

    /** ===================== Web (2 with n8n) ===================== */
    {
      id: 'w1',
      title: 'Safarica – Travel Agency (MEAN + Stripe)',
      oneLiner:
        'End-to-end booking with admin auth, catalog, cart, Stripe payments/refunds, and ops workflows automated via n8n.',
      roles: ['fullstack'],
      tags: ['Angular', 'Node', 'Express', 'MongoDB', 'Stripe', 'JWT', 'Tailwind', 'n8n'],
      metrics: ['Checkout success +22%', 'Chargebacks ↓ 40%'],
      scope: 'Public app + admin panel',
      duration: '8 weeks',
      link: '/projects/safarica',
      n8n: true,
      n8nLink: '/automation/safarica-n8n',
    },
    {
      id: 'w2',
      title: 'SLA Reliability Dashboard',
      oneLiner:
        'SLA-focused dashboard (Azure/M365/on-prem probes) with enrichment, deduplication, and alerting orchestrated by n8n.',
      roles: ['fullstack', 'api'],
      tags: ['Angular', 'Node', 'Graph API', 'Azure Monitor', 'SLO/SLA', 'Teams Webhooks', 'n8n'],
      metrics: ['TTD ↓ 41%', 'False alarms ↓ 28%'],
      scope: 'SPA + API',
      duration: '3 weeks',
      link: '/projects/sla-dashboard',
      n8n: true,
      n8nLink: '/automation/sla-n8n',
    },
    {
      id: 'w3',
      title: 'Secure File Transfer Portal',
      oneLiner:
        'Angular + NestJS with expiring links, AV scanning, size quotas, and full audit trail for external sharing.',
      roles: ['fullstack', 'devsecops'],
      tags: ['Angular', 'NestJS', 'PostgreSQL', 'S3-compatible', 'ClamAV', 'OWASP ASVS'],
      metrics: ['Upload success +18%', 'Incidents: 0'],
      scope: 'Web app + worker',
      duration: '5 weeks',
      link: '/projects/secure-file-transfer',
    },

    /** ===================== DevSecOps (reduced) ===================== */
    {
      id: 'd1',
      title: 'Blue-Green CI/CD for Node Services',
      oneLiner: 'Slot-based deploys on Azure with smoke tests and one-click rollback.',
      roles: ['devsecops'],
      tags: ['Azure App Service', 'Slots', 'Docker', 'GitHub Actions', 'Playwright'],
      metrics: ['Zero downtime', 'Deploy time ↓ 70%'],
      scope: '4 microservices',
      duration: '3 weeks',
      link: '/projects/blue-green-cicd',
    },

    /** ===================== API (unchanged) ===================== */
    {
      id: 'a1',
      title: 'Intune Deployment Orchestrator API',
      oneLiner: 'REST API to stage Win32 apps, sync devices, and trigger policy assignments.',
      roles: ['api', 'sysadmin', 'devsecops'],
      tags: ['Intune Graph', 'Node', 'Express', 'Entra App', 'MSAL'],
      metrics: ['Rollout time ↓ 55%', 'Human error ↓ 80%'],
      scope: 'Service + CLI',
      duration: '2 weeks',
      link: '/projects/intune-orchestrator-api',
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

  isSysadmin(p: Project): boolean {
    return p.roles.includes('sysadmin');
  }

  /** Prefer p.link, fallback to blogLink if provided */
  getPrimaryLink(p: Project): string | null {
    return p.link || p.blogLink || null;
  }
}
