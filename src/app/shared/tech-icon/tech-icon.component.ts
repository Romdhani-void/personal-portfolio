import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TechIconName = 'docker' | 'kubernetes' | 'aws' | 'cicd' | 'jenkins' | 'terraform' | 'Helm' | 'tcloud';

@Component({
  selector: 'app-tech-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-icon.component.html',
  styleUrls: ['./tech-icon.component.css']
})
export class TechIconComponent {
  @Input() name!: TechIconName;

  private readonly labels: Record<TechIconName, string> = {
    docker: 'Docker',
    kubernetes: 'Kubernetes',
    Helm: 'Helm',
    aws: 'AWS',
    cicd: 'GitHub Actions',
    jenkins: 'Jenkins',
    terraform: 'Terraform',
    tcloud: 'Cloud'
  };

  private readonly sources: Record<TechIconName, string> = {
    docker: 'assets/img/tech/docker.png',
    kubernetes: 'assets/img/tech/kubernetes.png',
    Helm: 'assets/img/tech/helm.png',
    aws: 'assets/img/tech/aws.png',
    cicd: 'assets/img/tech/github-actions.png',
    jenkins: 'assets/img/tech/jenkins.png',
    terraform: 'assets/img/tech/terraform.png',
    tcloud: 'assets/img/tech/tcloud.png'
  };

  get label(): string {
    return this.labels[this.name] ?? '';
  }

  get src(): string {
    return this.sources[this.name] ?? '';
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).style.visibility = 'hidden';
  }
}