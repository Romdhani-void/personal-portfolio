import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

interface Chapter {
  label: string;
  time: number; // seconds
  description: string;
  bullets?: string[];
  image: string;
}

interface ArticleBlock {
  id: string;
  heading: string;
  paragraphs: string[];
  image?: string;
  imageCaption?: string;
  codeBlock?: string;
}

interface DevopsSection {
  key: string;
  label: string;
  videoTitle: string;
  videoSrc: string;
  duration: string;
  overview: string;
  chapters: Chapter[];
  isArticle?: boolean;
  articleReadTime?: string;
  articleBlocks?: ArticleBlock[];
}

@Component({
  selector: 'app-nutritracker-devops',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './nutritracker-devops.component.html',
  styleUrls: ['./nutritracker-devops.component.css']
})
export class NutritrackerDevopsComponent implements AfterViewInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  constructor(private location: Location) {}

  ngAfterViewInit(): void {
    this.applyDefaultVolume();
  }

  /**
   * Sets default video volume to 30% (0.3).
   * Call this on (loadedmetadata) in HTML to handle switching video sections.
   */
  setInitialVolume(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (video) {
      video.volume = 0.3;
    }
  }

  private applyDefaultVolume(): void {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.volume = 0.3;
    }
  }

  goBack() {
    this.location.back();
  }

  private img(section: string, n: number): string {
    return `assets/img/nutritracker-devops/${section}-image${n}.jpg`;
  }

  private imgFile(name: string): string {
    return `assets/img/nutritracker-devops/${name}`;
  }

  formatBullet(text: string): string {
    const trimmed = text.trim();
    return trimmed.replace(
      /`([^`]+)`/g,
      '<code class="font-semibold text-slate-800 bg-slate-100 rounded px-1 py-0.5 text-[11px]">$1</code>'
    );
  }

  sections: DevopsSection[] = [
    {
      key: 'overview',
      label: 'Project Overview',
      videoTitle: 'NutriTracker Architecture and Deployment Overview',
      videoSrc: '',
      duration: '8:00',
      overview: '',
      chapters: [],
      isArticle: true,
      articleReadTime: '3 min read',
      articleBlocks: [
        {
          id: 'intro',
          heading: 'What NutriTracker Is',
          image: 'assets/img/nutritracker-devops/homepage.jpg',
          imageCaption: 'NutriTracker application homepage',
          paragraphs: [
            'NutriTracker is a nutrition tracking application that lets users log daily meals, set nutrition goals, and follow their progress over time. It pairs a clean Angular frontend with a microservice backend and a fully automated AWS delivery pipeline.',
            'Beyond the product itself, the project is a hands-on showcase of modern DevOps: containerization, infrastructure as code, Kubernetes, CI/CD, and live monitoring.',
          ]
        },
        {
          id: 'architecture-and-infra',
          heading: 'Architecture, Containers & Infrastructure',
          image: this.img('overview', 2),
          imageCaption: 'NutriTracker microservices, Docker, and Terraform foundation',
          paragraphs: [
            'The app is built as independently deployable microservices (users, goals, daily logs) behind an API layer, with an Angular frontend consuming them. Each service is containerized with Docker and published to Amazon ECR as immutable, versioned images.',
            'A shared Docker Compose setup runs the full stack locally, while the entire AWS foundation, including the VPC, networking, IAM, and EKS, is provisioned with Terraform as repeatable, version-controlled code.',
          ]
        },
        {
          id: 'deploy-monitor',
          heading: 'Kubernetes, CI/CD & Monitoring',
          image: this.img('overview', 7),
          imageCaption: 'NutriTracker EKS, automated pipeline, and Grafana telemetry',
          paragraphs: [
            'Workloads run on Amazon EKS and are exposed through an AWS Application Load Balancer, giving scheduling, scaling, and self-healing out of the box. GitHub Actions automates the whole release: every push builds images, provisions infrastructure, deploys with Helm, and verifies the rollout.',
            'Prometheus and Grafana provide real-time telemetry across the microservices, surfacing request rates, errors, and latency. Autoscaling and tighter alerting are the next steps.',
          ]
        },
      ]
    },
    {
      key: 'docker',
      label: 'Docker',
      videoTitle: 'NutriTracker: Docker',
      videoSrc: 'assets/video/nutritracker-docker.mp4',
      duration: '',
      overview: 'Walkthrough of containerizing NutriTracker, building separate images for the backend services and frontend, wiring them together with Docker Compose, and setting up Mongo and environment variables.',
      chapters: [
        { label: 'Backend Docker creation', time: 104, image: '', description: '' },
        { label: 'Frontend Docker creation', time: 296, image: '', description: '' },
        { label: 'Orchestration with Compose.yaml', time: 497, image: '', description: '' },
        { label: 'Setup mongo import configuration', time: 710, image: '', description: '' },
        { label: '.env file setup and link with compose', time: 769, image: '', description: '' },
      ]
    },
    {
      key: 'iac-network',
      label: 'IaC: Network',
      videoTitle: 'NutriTracker Infrastructure as Code: Network',
      videoSrc: 'assets/video/nutritracker-iac.mp4',
      duration: '',
      overview: 'Automating the AWS networking foundation for the EKS cluster with Terraform, a repeatable, version-controlled VPC design built for high availability and security.',
      chapters: [
        {
          label: 'Infrastructure explanation',
          time: 143,
          image: this.img('iac-network', 1),
          description: '',
          bullets: [
            'The deployment targets `eu-central-1` (Frankfurt), chosen as the closest region.',
            'A VPC is created with CIDR block `10.0.0.0/16`.',
            'The network is spread across multiple availability zones for high availability.',
            'Subnet layout includes:',
            '  public subnets for internet-facing resources',
            '  private application subnets for EC2/EKS workloads',
            '  isolated private database subnets',
            'Example CIDR allocation follows a structured pattern such as `10.0.1.0/24`, `10.0.2.0/24`, and `10.0.3.0/24` across zones.',
          ]
        },
        {
          label: 'Terraform Project Structure',
          time: 675,
          image: '',
          description: '',
          bullets: [
            'The Terraform code is split into two main parts:',
            '  `modules/` for reusable infrastructure components',
            '  environment folders such as `dev/`, `prod/`, and `state/`',
            'Modules mentioned include:',
            '  `ecr`',
            '  `network`',
            '  `iam`',
            '  `eks`',
            'The `dev` environment is currently implemented, with the same modules intended for future environments.',
            'Environment-specific values such as instance size and desired node count are kept separate from reusable logic.',
          ]
        },
        { label: 'ECR Module', time: 918, image: '', description: '' },
        { label: 'Network Module Design', time: 1025, image: '', description: '' },
        {
          label: 'Subnet Creation and Tagging',
          time: 1084,
          image: '',
          description: '',
          bullets: [
            'The VPC is created first, then public, private, and database subnets are generated with `for_each`.',
            'Each subnet resource uses:',
            '  the VPC ID',
            '  the subnet CIDR block',
            '  the assigned availability zone',
            'Subnet names are tagged using the map key, such as `public subnet 1`, `public subnet 2`, and so on.',
            'The same pattern is reused for private and database subnets.',
          ]
        },
        { label: 'Route Tables, Associations, and NAT Gateway', time: 1570, image: '', description: '' },
        { label: 'Outputs and Reusability', time: 1920, image: '', description: '' },
        { label: 'Validation and Terraform Plan', time: 1988, image: '', description: '' },
      ]
    },
    {
      key: 'iac-iam-eks',
      label: 'IaC: IAM & EKS',
      videoTitle: 'NutriTracker Infrastructure as Code: IAM and EKS',
      videoSrc: 'assets/video/nutritracker-iac-iam-eks.mp4',
      duration: '',
      overview: 'Setting up IAM roles, OIDC trust, and workload permissions so the EKS cluster and its add-ons can securely access AWS services.',
      chapters: [
        {
          label: 'IAM Roles for Cluster and Nodes',
          time: 57,
          image: '',
          description: '',
          bullets: [
            'A dedicated IAM role is created for the EKS control plane, trusted by `eks.amazonaws.com` with the **Amazon EKS Cluster Policy** attached.',
            'A separate IAM role is created for worker nodes, trusted by `ec2.amazonaws.com`, with policies for node access, CNI networking, and read-only ECR pulls.',
            'Cluster name and role ARNs are parameterized and exported for reuse across environments.',
          ]
        },
        {
          label: 'Building the EKS Cluster',
          time: 286,
          image: '',
          description: '',
          bullets: [
            'The EKS module references the exported role ARNs for the cluster and node group.',
            'Worker nodes are placed in private subnets from the network module.',
            'Instance type and scaling values (`desired_size`, `min_size`, `max_size`) are set as environment-specific variables.',
            'Node count needs enough capacity for all pods, including monitoring, to avoid scheduling failures.',
          ]
        },
        {
          label: 'OIDC Trust Setup',
          time: 574,
          image: this.imgFile('oidc-eks.jpg'),
          description: '',
          bullets: [
            'EKS automatically creates an OIDC issuer URL used to federate workload identity with AWS.',
            'The OIDC issuer TLS certificate is retrieved to validate the identity provider connection.',
            'An IAM OIDC provider resource is created using the issuer URL, certificate thumbprint, and `sts.amazonaws.com` client ID.',
            'This forms the permanent trust bridge STS uses to validate pod identity tokens.',
          ]
        },
        {
          label: 'IRSA for Service Accounts',
          time: 1289,
          image: this.imgFile('irsa-eks.jpg'),
          description: '',
          bullets: [
            'IAM Roles for Service Accounts (IRSA) give workloads like the AWS Load Balancer Controller, EBS CSI Driver, and External Secrets Operator scoped AWS access.',
            'Each role is restricted to a specific Kubernetes namespace and service account via the `sub` condition, preventing other pods from impersonating it.',
            'Policy strategy is chosen per workload: AWS-managed, customer-managed, or inline.',
          ]
        },
        {
          label: 'Attaching Policies per Workload',
          time: 1622,
          image: '',
          description: '',
          bullets: [
            'EBS CSI Driver uses an AWS-managed policy referenced by ARN.',
            'AWS Load Balancer Controller uses a customer-managed policy downloaded as JSON and referenced by file path.',
            'External Secrets Operator uses an inline policy limited to `secretsmanager:GetSecretValue` and `secretsmanager:DescribeSecret`, scoped to a specific secret path like `secrets/<environment>/<service>`.',
          ]
        },
        {
          label: 'Installing Add-ons and Helm Workloads',
          time: 1865,
          image: '',
          description: '',
          bullets: [
            'Native AWS services like the EBS CSI Driver are installed as EKS add-ons using the cluster name, add-on name, and service account role ARN.',
            'Non-add-on workloads like the AWS Load Balancer Controller and External Secrets Operator are installed via Helm.',
            'Each policy is attached to its matching IAM role, and pairings are verified before deploying workloads.',
          ]
        },
      ]
    },
    {
      key: 'helm-deployment',
      label: 'Helm and Deployment',
      videoTitle: 'NutriTracker: Helm and Deployment',
      videoSrc: 'assets/video/nutritracker-helm-deployment.mp4',
      duration: '',
      overview: 'Deploying and validating NutriTracker on EKS end to end, from provisioning infrastructure to a working public-facing application in the browser.',
      chapters: [
        {
          label: 'Provision Infrastructure and Retrieve Values',
          time: 47,
          image: '',
          description: '',
          bullets: [
            'A deployment checklist covers the full flow: provision infra, connect `kubectl`, install controllers, wire secrets, deploy the chart, and validate in the browser.',
            'Terraform is initialized, planned, and applied from the environment directory.',
            'After apply, the VPC ID is retrieved from `terraform state show` since it can change after a destroy/reapply cycle, then updated wherever it is referenced.',
            'The EKS cluster ARN and AWS account ID are confirmed for the External Secrets configuration.',
          ]
        },
        {
          label: 'Connect kubectl to the Cluster',
          time: 466,
          image: '',
          description: '',
          bullets: [
            'The cluster name is retrieved from Terraform outputs.',
            'The AWS CLI updates the kubeconfig for the correct cluster and region.',
            'Access is validated by running `kubectl get nodes` before continuing.',
          ]
        },
        {
          label: 'Install Controllers',
          time: 613,
          image: '',
          description: '',
          bullets: [
            'Helm repositories are added for the AWS Load Balancer Controller and External Secrets Operator, then updated with `helm repo update`.',
            'External Secrets Operator is installed into its own namespace and verified with `kubectl get pods`.',
            'AWS Load Balancer Controller is checked in `kube-system` and installed if missing, then confirmed healthy before moving on.',
          ]
        },
        {
          label: 'Configure the Secret Pipeline',
          time: 1001,
          image: '',
          description: '',
          bullets: [
            'The application namespace is created.',
            'A `ClusterSecretStore` is applied so External Secrets can read from AWS Secrets Manager.',
            '`ExternalSecret` resources are applied for the app secrets and verified with `kubectl get secrets`.',
          ]
        },
        {
          label: 'Deploy the Application',
          time: 1265,
          image: '',
          description: '',
          bullets: [
            'Image tags in Amazon ECR are checked against what the Helm chart expects, resolving any mismatch first.',
            'The application Helm chart is installed into the app namespace using the environment-specific values file.',
            'Pods are checked with `kubectl get pods`, using `--watch` to monitor startup.',
          ]
        },
        {
          label: 'Validate Ingress and Browser Access',
          time: 1514,
          image: '',
          description: '',
          bullets: [
            'The ingress address is retrieved with `kubectl get ingress`; if missing, the AWS Load Balancer Controller is checked first.',
            'The ingress URL is opened in the browser over HTTP.',
            'Local DNS cache is flushed if the browser shows a DNS-related error, then the URL is retried to confirm the app loads.',
          ]
        },
      ]
    },
    {
      key: 'monitoring',
      label: 'Monitoring (Grafana)',
      videoTitle: 'NutriTracker: Monitoring with Grafana',
      videoSrc: '',
      duration: '',
      overview: 'Full setup of application telemetry, Prometheus target discovery, and Grafana dashboard visualization across NutriTracker EKS microservices.',
      chapters: [],
      isArticle: true,
      articleReadTime: '4 min read',
      articleBlocks: [
        {
          id: 'instrumentation',
          heading: 'Application Metric Instrumentation',
          paragraphs: [
            'To enable real-time visibility into application health, we integrated <span class="highlight-tech">express-prom-bundle</span> middleware at the top of the Express pipeline in our Node.js microservices.',
            'This automatically generates standard RED metrics (Rate, Errors, Duration) alongside Node.js runtime stats (CPU, memory usage, and event loop latency) exposed on the <span class="highlight-action">/metrics</span> endpoint.'
          ],
          codeBlock: `// 1. Install Prometheus Dependencies
npm install prom-client express-prom-bundle

// 2. Application Instrumentation (Registered BEFORE routes)
const express = require('express');
const promBundle = require('express-prom-bundle');
const app = express();

const metricsMiddleware = promBundle({
  includeMethod: true,
  includePath: true,
  includeStatusCode: true,
  includeUp: true,
  promClient: { collectDefaultMetrics: {} }
});

app.use(metricsMiddleware);`
        },
        {
          id: 'container-push',
          heading: 'ECR Publishing & Helm Rollout',
          image: this.imgFile('kubectl get pods,svc,ingress -n nutri-track.jpg'),
          imageCaption: 'Active EKS Cluster Workloads, ClusterIP Services, and AWS ALB Ingress Endpoint',
          paragraphs: [
            'After updating the application code, the microservice Docker image was rebuilt and pushed to <span class="highlight-tech">Amazon ECR</span> under the <span class="highlight-action">metrics-v1</span> tag.',
            'We then updated the Helm <span class="highlight-action">values-dev.yaml</span> release configuration and performed a rolling upgrade to deploy the updated containers to the EKS cluster.'
          ],
          codeBlock: `# Tag and Push to ECR
docker tag nutritracker-daily-log-service:metrics 566167302576.dkr.ecr.eu-central-1.amazonaws.com/nutritracker-daily-log-service-dev:metrics-v1
docker push 566167302576.dkr.ecr.eu-central-1.amazonaws.com/nutritracker-daily-log-service-dev:metrics-v1

# Upgrade Helm Release
helm upgrade --install nutri-track helm/nutri-track -f helm/nutri-track/values-dev.yaml -n nutri-track`
        },
        {
          id: 'ingress-verification',
          heading: 'AWS Load Balancer Access Verification',
          image: this.imgFile('nutritrack .jpg'),
          imageCaption: 'NutriTracker Frontend Application Accessible via AWS Application Load Balancer',
          paragraphs: [
            'With the updated pods running behind the <span class="highlight-tech">AWS Load Balancer Controller</span>, we verified live public access directly through the generated ALB DNS name.',
            'Sending HTTP traffic through the public ALB validates that external requests are correctly routed down to the internal pod network.'
          ]
        },
        {
          id: 'prometheus-targets',
          heading: 'Prometheus Target Discovery',
          image: this.imgFile('Prometheus ServiceMonitor Target Status.jpg'),
          imageCaption: 'Active Port-Forwarding Session to Verify Prometheus Operator Status',
          paragraphs: [
            'The <span class="highlight-tech">kube-prometheus-stack</span> uses custom <span class="highlight-action">ServiceMonitor</span> resources to automatically discover active pod endpoints across the <span class="highlight-action">nutri-track</span> namespace.',
            'We opened a secure port-forward to the internal Prometheus server to verify that target scraping was healthy and active.'
          ],
          codeBlock: `# Port-Forward Prometheus Service
kubectl port-forward svc/kube-prometheus-stack-prometheus 9091:9090 -n monitoring`
        },
        {
          id: 'grafana-telemetry',
          heading: 'Grafana Dashboards & Live PromQL Telemetry',
          image: this.imgFile('query.jpg'),
          imageCaption: 'Grafana Explore Interface: Real-Time PromQL Pod Status & Traffic Querying',
          paragraphs: [
            'Grafana was connected to the internal Prometheus data source, allowing us to execute live <span class="highlight-tech">PromQL</span> queries across cluster workloads.',
            'Using queries such as <span class="highlight-action">up{namespace="nutri-track"}</span> and <span class="highlight-action">rate(http_request_duration_seconds_count[1m])</span>, we can monitor request volume, pod restarts, and latency spikes across microservices in real time.'
          ],
          codeBlock: `# Port-Forward Grafana Dashboard
kubectl port-forward svc/kube-prometheus-stack-grafana 8080:80 -n monitoring

# PromQL Request Rate Query
sum(rate(http_request_duration_seconds_count[1m])) by (pod)`
        }
      ]
    },
    {
      key: 'cicd',
      label: 'CI/CD (GitHub Actions)',
      videoTitle: 'NutriTracker: CI/CD Pipeline',
      videoSrc: '',
      duration: '',
      overview: 'In earlier videos, I demonstrated the manual process: running terraform apply, building the EKS cluster, configuring OIDC and IRSA, deploying the AWS Load Balancer Controller and External Secrets Operator (ESO), installing the Helm charts, grabbing the ALB address, and checking the live app. This CI/CD pipeline was built to completely automate that exact workflow.',
      chapters: [],
      isArticle: true,
      articleReadTime: '4 min read',
      articleBlocks: [
        {
          id: 'trigger',
          heading: 'Automating the Workflow',
          image: this.img('cicd', 1),
          imageCaption: 'The workflow triggering on a push to devOps, all four jobs queued in GitHub Actions.',
          paragraphs: [
            'Every push to the devOps branch automatically triggers the exact same provisioning and deployment steps I demonstrated earlier. <span class="highlight-action">We used</span> <span class="highlight-tech">GitHub Actions</span> <span class="highlight-action">to automate the entire process</span> to have <span class="highlight-result">a fully hands-off delivery pipeline</span>.'
          ]
        },
        {
          id: 'images',
          heading: 'Automated Image Builds',
          paragraphs: [
            'Instead of building manually, <span class="highlight-action">we used</span> <span class="highlight-tech">Docker Buildx</span> <span class="highlight-action">in the pipeline</span> to have <span class="highlight-result">immutable run-number tags automatically built and pushed to Amazon ECR for our microservices</span>.'
          ],
          codeBlock: `- name: Push frontend\n  uses: docker/build-push-action@v5\n  with:\n    context: ./frontend\n    push: true\n    tags: \${{ steps.login-ecr.outputs.registry }}/nutritracker-frontend-dev:1.0.\${{ github.run_number }}`
        },
        {
          id: 'alb-eso',
          heading: 'Automating ALB & ESO Setup',
          paragraphs: [
            'The pipeline automates what I did previously by executing the necessary helm charts for our add-ons. <span class="highlight-action">We used</span> the <span class="highlight-tech">AWS Load Balancer Controller</span> and the <span class="highlight-tech">External Secrets Operator</span> steps <span class="highlight-action">to dynamically provision our Application Load Balancers and secret managers</span> to have <span class="highlight-result">our cluster fully prepped before the main app is deployed</span>.'
          ],
          codeBlock: `- name: Install/Upgrade AWS Load Balancer Controller\n  run: |\n    helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \\\n      -n kube-system \\\n      -f helm/controllers/aws-load-balancer-controller-values.yaml \\\n      --set vpcId=\${{ steps.vpc.outputs.vpc_id }}`
        },
        {
          id: 'secrets',
          heading: 'Automated Secrets Synchronization',
          paragraphs: [
            'To replicate the manual secrets configuration, <span class="highlight-action">we used</span> the pipeline <span class="highlight-action">to apply our ExternalSecret resources securely</span> to have <span class="highlight-result">our app automatically pull the required DB and SMTP credentials from AWS Secrets Manager</span>.'
          ],
          codeBlock: `- name: Apply ExternalSecrets\n  run: |\n    kubectl create namespace nutri-track --dry-run=client -o yaml | kubectl apply -f -\n    kubectl apply -f helm/controllers/external-secrets/user-service.yaml\n    kubectl apply -f helm/controllers/external-secrets/goal-service.yaml\n    kubectl apply -f helm/controllers/external-secrets/daily-log-service.yaml\n    kubectl apply -f helm/controllers/external-secrets/mongo.yaml`
        },
        {
          id: 'deploy',
          heading: 'Automated Helm & EKS Rollout',
          paragraphs: [
            'Just like the manual `helm install` steps, <span class="highlight-action">we used</span> <span class="highlight-tech">Helm</span> <span class="highlight-action">in the pipeline to orchestrate our Kubernetes deployment</span>. The workflow automatically applies our charts and runs `kubectl rollout status` to have <span class="highlight-result">guaranteed confirmation that the app is healthy and serving traffic</span>.'
          ],
          codeBlock: `- name: Verify app rollout\n  run: |\n    kubectl rollout status deployment/nutri-track-frontend -n nutri-track --timeout=120s\n    kubectl rollout status deployment/user-service -n nutri-track --timeout=120s\n    kubectl rollout status deployment/goal-service -n nutri-track --timeout=120s\n    kubectl rollout status deployment/daily-log-service -n nutri-track --timeout=120s`
        }
      ]
    },
  ];

  active = this.sections[0].key;
  articleStepIndex = 0;
  articleViewAll = false;

  get activeSection(): DevopsSection {
    return this.sections.find(s => s.key === this.active) || this.sections[0];
  }

  get currentArticleBlock(): ArticleBlock | undefined {
    return this.activeSection.articleBlocks?.[this.articleStepIndex];
  }

  setActive(key: string) {
    this.active = key;
    this.articleStepIndex = 0;
    this.articleViewAll = false;
  }

  setArticleStep(i: number) {
    this.articleStepIndex = i;
    this.articleViewAll = false;
  }

  nextArticleStep() {
    const total = this.activeSection.articleBlocks?.length || 0;
    if (this.articleStepIndex < total - 1) {
      this.articleStepIndex++;
    }
  }

  prevArticleStep() {
    if (this.articleStepIndex > 0) {
      this.articleStepIndex--;
    }
  }

  toggleViewAll() {
    this.articleViewAll = !this.articleViewAll;
  }

  seekTo(seconds: number) {
    const video = this.videoPlayer?.nativeElement;
    if (!video) return;
    video.currentTime = seconds;
    video.play();
  }

  formatTime(totalSeconds: number): string {
    const m = Math.floor(totalSeconds / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}