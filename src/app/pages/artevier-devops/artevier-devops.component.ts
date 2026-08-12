import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NavbarComponent } from '../../shared/navbar/navbar.component';

interface ArticleBlock {
  id: string;
  heading: string;
  paragraphs: string[];
  image?: string;
  imageCaption?: string;
  video?: string;
  videoPoster?: string;
  codeBlock?: string;
}
interface DevopsSection {
  key: string;
  label: string;
  pageTitle: string;
  articleReadTime?: string;
  articleBlocks: ArticleBlock[];
}

@Component({
  selector: 'app-artevier-devops',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './artevier-devops.component.html',
  styleUrls: ['./artevier-devops.component.css'],
})
export class ArtevierDevopsComponent {
  constructor(private location: Location) {}

  darkMode = false;

  goBack() {
    this.location.back();
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle('dark', this.darkMode);
  }

  formatBullet(text: string): string {
    const trimmed = text.trim();
    return trimmed.replace(
      /`([^`]+)`/g,
      '<code class="font-semibold text-slate-800 bg-slate-100 rounded px-1 py-0.5 text-[11px]">$1</code>',
    );
  }

  sections: DevopsSection[] = [
    {
      key: 'overview',
      label: 'Project Overview',
      pageTitle: 'Artevier Architecture and Deployment Overview',
      articleReadTime: '4 min read',
      articleBlocks: [
        {
          id: 'what-this-app-does',
          heading: 'What This App Does',
          paragraphs: [
            'Artisan Sink Studio is a full-stack e-commerce platform for handcrafted kitchen sinks, copper farmhouse basins, glazed fireclay vessels, granite composite designs, and more.',
            'It supports a complete shopping experience (browse, filter, cart, checkout, order tracking) alongside a full admin back-office (product/inventory management, order management, user management, sales stats).',
            'The storefront supports three languages (<span class="highlight-tech">English</span>, <span class="highlight-tech">French</span>, <span class="highlight-tech">Hungarian</span>) and two currencies (<span class="highlight-action">EUR</span>, <span class="highlight-action">HUF</span>) with role-based access separating regular customers from admin users.',
          ],
          image: 'assets/img/artevier/frontend.jpg',
          imageCaption: 'Artisan Sink Studio: live storefront landing page',
        },
        {
          id: 'microservice-architecture',
          heading: 'Microservice Architecture',
          paragraphs: [
            'Artevier (repository name <span class="highlight-tech">Artisan Sink Studio</span>) is built as five independent Node.js/Express services behind a single <span class="highlight-tech">API Gateway</span>, plus an <span class="highlight-tech">Angular 19</span> frontend.',
            'The gateway on port <span class="highlight-action">3000</span> is the only public entry point: it verifies JWTs, applies rate limiting, and routes requests to whichever downstream service owns that resource.',
          ],
          codeBlock: `Artisan-Sink-Studio/
├── api-gateway/            # Port 3000  - Routing, JWT verification, rate limiting
├── user-service/           # Port 3001  - Auth, registration, profiles
├── product-service/        # Port 3002  - Catalog, reviews, inventory
├── order-service/          # Port 3003  - Cart, checkout, order history
├── notification-service/   # Port 3004  - Emails (welcome, order confirmation)
└── frontend/                # Port 4200 (dev) / 80 (prod) - Angular 19 + Tailwind`,
        },
        {
          id: 'service-responsibilities',
          heading: 'Service Responsibilities',
          paragraphs: [
            'Each service owns a single responsibility: <span class="highlight-tech">User Service</span> handles registration, login, and admin user management; <span class="highlight-tech">Product Service</span> owns the catalog, filtering, reviews, and inventory.',
            '<span class="highlight-tech">Order Service</span> covers cart, checkout, and order history, and <span class="highlight-tech">Notification Service</span> sends welcome emails, order confirmations, and handles the contact form.',
          ],
          codeBlock: `Service                 Port    Responsibility
API Gateway             3000    Single entry point, JWT verification, rate limiting, routing
User Service            3001    Registration, login, profile management, admin user management
Product Service         3002    Product catalog, filtering, reviews, admin inventory management
Order Service            3003    Cart, checkout, order history, admin order management
Notification Service    3004    Welcome emails, order confirmations, contact form handling`,
        },
        {
          id: 'data-layer',
          heading: 'Data Layer & Service Communication',
          paragraphs: [
            'Every backend service except the gateway owns its own <span class="highlight-tech">MongoDB</span> database, so there is no shared schema or cross-service table joins.',
            'Authentication is stateless: a shared <span class="highlight-action">JWT secret</span> lets every service independently verify a token that was issued once at login, with no session store to keep in sync.',
            'Internal calls bypass the gateway entirely. <span class="highlight-tech">Order Service</span> talks directly to <span class="highlight-tech">Product Service</span> for stock and price validation, and directly to <span class="highlight-tech">Notification Service</span> to trigger confirmation emails.',
          ],
          codeBlock: `Service                 Database
User Service            userdb
Product Service         productdb
Order Service            orderdb
Notification Service    notificationdb`,
        },
      ],
    },
    {
      key: 'docker',
      label: 'Docker',
      pageTitle: 'Artevier: Docker',
      articleReadTime: '4 min read',
      articleBlocks: [
        {
          id: 'frontend-docker',
          heading: 'Frontend Docker Image',
          paragraphs: [
            'The Angular app builds through a <span class="highlight-tech">multi-stage Dockerfile</span>: the first stage compiles the production bundle, and the second stage copies only the built output into an <span class="highlight-tech">nginx</span> image.',
            'In production the container serves the compiled frontend on port <span class="highlight-action">80</span>, while local development still runs through the Angular dev server on port <span class="highlight-action">4200</span>.',
          ],
          codeBlock: `frontend/artisan-sink-studio/
├── src/app/
│   ├── core/     # Services, guards, interceptors
│   ├── pages/    # Home, catalog, product detail, admin, auth
│   └── shared/   # Reusable components (pipes, cards)
└── Dockerfile    # Multi-stage build -> nginx (port 80)`,
        },
        {
          id: 'backend-microservice-images',
          heading: 'Backend Microservice Docker Images',
          paragraphs: [
            'Each of the 5 backend services (`api-gateway`, `user-service`, `product-service`, `order-service`, `notification-service`) builds from a lightweight `Node 20 Alpine` image.',
            "A shared internal module (`shared/logger`, `shared/errors`) lives outside each service's own folder, so the build context for every backend service is scoped to the parent `backend/` directory rather than the individual service folder, this makes the shared code visible to the build, which a service-scoped context cannot see.",
          ],
          codeBlock: `FROM node:20-alpine
WORKDIR /app
COPY api-gateway/package*.json ./
RUN npm install
COPY api-gateway/. .
COPY shared ./shared
COPY shared /shared
EXPOSE 3000
CMD ["npm", "start"]`,
        },
        {
          id: 'docker-compose-orchestration',
          heading: 'Docker Compose Orchestration',
          paragraphs: [
            'A single `compose.yaml` at the project root defines all 7 containers (5 backend services, MongoDB, mongo-express, and the frontend) as one orchestrated stack.',
            'Each backend service explicitly sets its build `context` to `./backend` and its `dockerfile` path to `<service>/Dockerfile`, keeping the shared-module structure consistent across every service.',
          ],
          codeBlock: `user-service:
  build:
    context: ./backend
    dockerfile: user-service/Dockerfile
  container_name: user-service
  ports:
    - "3001:3001"
  environment:
    MONGODB_URI: \${MONGODB_URI_USER}
    JWT_SECRET: \${JWT_SECRET}
    NODE_ENV: \${NODE_ENV}
  depends_on:
    - mongo`,
        },
        {
          id: 'env-vars-local-secrets',
          heading: 'Environment Variables & Local Secrets',
          paragraphs: [
            'All runtime configuration, database URIs, the shared JWT secret and its expiry, service-to-service URLs, rate limiting, and SMTP credentials for transactional email, is injected via a single root-level `.env` file, referenced in `compose.yaml` using `${VARIABLE}` interpolation.',
            'Each service gets its own <span class="highlight-tech">MongoDB</span> connection string built from the same root credentials (`MONGODB_URI_USER`, `MONGODB_URI_PRODUCT`, `MONGODB_URI_ORDER`, `MONGODB_URI_NOTIFICATION`), and internal service-to-service calls resolve through fixed URLs like `USER_SERVICE_URL` and `ORDER_SERVICE_URL` rather than hardcoded hostnames.',
            "I've hidden the actual values for the Mongo root password, JWT secret, and SMTP credentials below for security reasons since this page is public, marked as `HIDDEN_FOR_SECURITY_REASONS`. This file is gitignored in the real repo; only a documented `.env.example` template with placeholder values is committed.",
            'Locally, secrets exist purely as plain environment variables, this is intentionally the simplest possible setup, since proper secrets management (<span class="highlight-tech">AWS Secrets Manager</span>, synced via <span class="highlight-tech">External Secrets Operator</span>) is introduced later in the Kubernetes stage.',
          ],
          codeBlock: `MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=HIDDEN_FOR_SECURITY_REASONS
FRONTEND_URL=http://localhost
JWT_SECRET=HIDDEN_FOR_SECURITY_REASONS
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
USER_SERVICE_URL=http://user-service:3001
PRODUCT_SERVICE_URL=http://product-service:3002
ORDER_SERVICE_URL=http://order-service:3003
NOTIFICATION_SERVICE_URL=http://notification-service:3004
MONGODB_URI_USER=mongodb://\${MONGO_ROOT_USER}:\${MONGO_ROOT_PASSWORD}@mongo:27017/userdb?authSource=admin
MONGODB_URI_PRODUCT=mongodb://\${MONGO_ROOT_USER}:\${MONGO_ROOT_PASSWORD}@mongo:27017/productdb?authSource=admin
MONGODB_URI_ORDER=mongodb://\${MONGO_ROOT_USER}:\${MONGO_ROOT_PASSWORD}@mongo:27017/orderdb?authSource=admin
MONGODB_URI_NOTIFICATION=mongodb://\${MONGO_ROOT_USER}:\${MONGO_ROOT_PASSWORD}@mongo:27017/notificationdb?authSource=admin
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=200
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=HIDDEN_FOR_SECURITY_REASONS
SMTP_PASS=HIDDEN_FOR_SECURITY_REASONS
FROM_EMAIL=noreply@artisansinkstudio.com`,
        },
      ],
    },
    {
      key: 'iac',
      label: 'IaC: Terraform',
      pageTitle: 'Artevier: Infrastructure as Code',
      articleReadTime: '7 min read',
      articleBlocks: [
        {
          id: 'infra-overview',
          heading: 'Multi-AZ AWS Architecture',
          paragraphs: [
            'Artevier runs in <span class="highlight-tech">AWS eu-west-3</span> (Paris), chosen to keep latency low for its primary customer base in France, spread across three Availability Zones for high availability.',
            'The <span class="highlight-tech">VPC</span> (`10.0.0.0/16`) repeats the same three-tier subnet layout in every AZ: a public subnet for internet-facing resources, a private app subnet for <span class="highlight-tech">EKS</span> worker nodes, and a private database subnet for <span class="highlight-tech">MongoDB</span>.',
            'Inbound traffic flows through an <span class="highlight-action">Internet Gateway</span> to an <span class="highlight-action">Application Load Balancer</span>, which routes to EKS worker nodes in whichever AZ. A dedicated <span class="highlight-action">NAT Gateway</span> per AZ lets those private worker nodes reach the internet outbound, without ever being publicly reachable themselves.',
            'The database tier runs a <span class="highlight-tech">MongoDB Replica Set</span> with one primary and two secondaries, one member per AZ, so the app keeps running even if an entire Availability Zone goes down. Container images are built and pushed to <span class="highlight-tech">Amazon ECR</span>, then deployed onto EKS.',
          ],
          image: 'assets/img/artevier/aws-network-architecture.png',
          imageCaption:
            'Artevier: multi-AZ AWS architecture (VPC, EKS, MongoDB replica set, ECR)',
          codeBlock: `VPC                       10.0.0.0/16          eu-west-3 (Paris)

Availability Zone         Public Subnet    Private App Subnet    Database Subnet
eu-west-3a                10.0.1.0/24      10.0.2.0/24           10.0.3.0/24
eu-west-3b                10.0.11.0/24     10.0.21.0/24          10.0.31.0/24
eu-west-3c                10.0.12.0/24     10.0.22.0/24          10.0.32.0/24

MongoDB Replica Set:      eu-west-3a = PRIMARY, eu-west-3b / eu-west-3c = SECONDARY`,
        },
        {
          id: 'networking-ecr',
          heading: 'Networking & Container Registry',
          paragraphs: [
            'The `modules/network` module provisions one VPC (`10.0.0.0/16`) with nine subnets total, three public, three private, three database, spread evenly across the three Availability Zones.',
            'A single Internet Gateway sits at the edge of the VPC. Each AZ gets its own NAT Gateway and Elastic IP (three of each), so private subnets can reach the internet outbound without any resource inside them being publicly reachable.',
            'Routing is per-tier and per-AZ: one shared public route table, plus one private and one database route table per AZ (seven route tables total), each explicitly associated to its own subnet (nine associations).',
            'Container images live in <span class="highlight-tech">Amazon ECR</span>, one repository per service (`api_gateway`, `frontend`, `notification_service`, `order_service`, `product_service`, `user_service`), all set to `IMMUTABLE` tags, so a pushed image tag can never be silently overwritten.',
          ],
          codeBlock: `Resource                    Count   Notes
VPC                          1       10.0.0.0/16
Subnets (public/private/db)  9       3 per tier, 1 per AZ
Internet Gateway             1       Shared entry point
NAT Gateways + EIPs          3 + 3   One per AZ
Route tables                 7       1 public, 3 private, 3 db
Route table associations     9       1 per subnet
ECR repositories             6       IMMUTABLE tags, one per service`,
        },
        {
          id: 'controller-discovery-tags',
          heading: 'Discovery Tags for Cluster Controllers',
          paragraphs: [
            "Subnets carry specific tags that let cluster controllers auto-discover where they're allowed to operate, rather than being hardcoded with subnet IDs.",
            'Public subnets are tagged `kubernetes.io/role/elb` so the <span class="highlight-tech">AWS Load Balancer Controller</span> knows where it can place internet-facing load balancers. Private subnets are tagged for internal-elb placement plus `karpenter.sh/discovery`, so <span class="highlight-tech">Karpenter</span> knows which subnets it\'s allowed to launch nodes into.',
            "Both subnet tiers also carry `kubernetes.io/cluster/artevier-eks-cluster=shared`, the standard tag EKS controllers use to recognize which VPC resources belong to this cluster. The cluster's auto-generated security group gets a matching discovery tag too, applied via a dedicated `aws_ec2_tag` resource.",
          ],
          codeBlock: `Subnet tier      Tags
Public           kubernetes.io/role/elb = 1
                 kubernetes.io/cluster/artevier-eks-cluster = shared

Private          kubernetes.io/role/internal-elb = 1
                 karpenter.sh/discovery = artevier-eks-cluster
                 kubernetes.io/cluster/artevier-eks-cluster = shared

Cluster SG       karpenter.sh/discovery = artevier-eks-cluster  (via aws_ec2_tag)`,
        },
        {
          id: 'iam-roles',
          heading: 'IAM Roles for the EKS Control Plane and Nodes',
          paragraphs: [
            'The `modules/iam` module creates two roles, scoped to the minimum each identity needs. `eks_cluster_role` is assumable only by `eks.amazonaws.com` and carries the `AmazonEKSClusterPolicy`.',
            '`eks_node_group_role` is assumable only by `ec2.amazonaws.com` and carries three policy attachments: `AmazonEKSWorkerNodePolicy` (join the cluster), `AmazonEKS_CNI_Policy` (pod networking), and `AmazonEC2ContainerRegistryReadOnly` (pull images from ECR).',
          ],
          codeBlock: `Role                       Trusted Principal      Attached Policies
eks_cluster_role           eks.amazonaws.com       AmazonEKSClusterPolicy
eks_node_group_role        ec2.amazonaws.com       AmazonEKSWorkerNodePolicy
                                                    AmazonEKS_CNI_Policy
                                                    AmazonEC2ContainerRegistryReadOnly`,
        },
        {
          id: 'eks-cluster-nodegroup',
          heading: 'EKS Cluster, Node Group & OIDC',
          paragraphs: [
            'The `modules/eks` module provisions the cluster, `artevier-eks-cluster` on <span class="highlight-tech">Kubernetes 1.33</span>, spread across all three private app subnets.',
            'A single managed node group runs on <span class="highlight-action">t3.small</span> instances, scaling between 1 (minimum) and 3 (maximum), with 2 as the steady-state desired count.',
            'An <span class="highlight-tech">OIDC provider</span> is created for the cluster, which is what makes <span class="highlight-tech">IRSA</span> (IAM Roles for Service Accounts) possible: individual Kubernetes service accounts can assume specific IAM roles directly.',
          ],
          codeBlock: `Cluster name        artevier-eks-cluster
Kubernetes version  1.33
Subnets             3 private app subnets (1 per AZ)
Node group          t3.small, min 1 / desired 2 / max 3
OIDC provider       Created from cluster OIDC issuer`,
        },
        {
          id: 'irsa-addons',
          heading: 'IRSA Roles for Cluster Add-ons',
          paragraphs: [
            'Three IRSA roles are defined on top of the OIDC provider. The <span class="highlight-tech">EBS CSI Driver</span> role carries the managed `AmazonEBSCSIDriverPolicy` and is wired to a real `aws_eks_addon`, so EBS-backed persistent volumes work.',
            'The <span class="highlight-tech">AWS Load Balancer Controller</span> role carries a custom policy, rendered via `templatefile()`, covering ALB/NLB provisioning, target groups, security groups, listener/rule management, and WAFv2/Shield attachment.',
            'The <span class="highlight-tech">External Secrets Operator</span> role carries a custom policy scoped to `secretsmanager:GetSecretValue` and `DescribeSecret` under the `artevier/dev/*` path only.',
          ],
          codeBlock: `IRSA Role                              Policy
ebs-csi-driver-role                    AmazonEBSCSIDriverPolicy (managed)
aws-load-balancer-controller-role      Custom (templatefile()): ALB/NLB, target groups,
                                        security groups, listeners, WAFv2, Shield
external-secrets-role                  Custom: secretsmanager:GetSecretValue,
                                        DescribeSecret, scoped to artevier/dev/*`,
        },
      ],
    },
    {
      key: 'kubernetes',
      label: 'Kubernetes & Helm',
      pageTitle: 'Artevier: Kubernetes Deployment',
      articleReadTime: '9 min read',
      articleBlocks: [
        {
          id: 'application-helm-chart',
          heading: 'Application Helm Chart (`helm/artevier`)',
          paragraphs: [
            'The app is deployed through a custom Helm chart, `Chart.yaml`, a base `values.yaml`, and a `values-dev.yaml` carrying the real ECR image URLs for this environment.',
            'Each of the 6 microservices gets its own templated <span class="highlight-tech">Deployment</span> and <span class="highlight-tech">Service</span>, pulling secrets at runtime via `envFrom.secretRef`, pointing at the Kubernetes Secrets that <span class="highlight-tech">External Secrets Operator</span> syncs in from AWS Secrets Manager.',
            'A single shared <span class="highlight-tech">Ingress</span> handles all external traffic with path-based routing through `api_gateway`, carrying ALB annotations for `internet-facing` scheme, `target-type: ip`, and a `/health` health check path.',
          ],
          codeBlock: `helm/artevier/
├── Chart.yaml
├── values.yaml
├── values-dev.yaml
└── templates/
    ├── api-gateway/          # Deployment + Service
    ├── user-service/         # Deployment + Service
    ├── product-service/      # Deployment + Service
    ├── order-service/        # Deployment + Service
    ├── notification-service/ # Deployment + Service
    ├── frontend/             # Deployment + Service
    └── ingress.yaml          # Shared Ingress, path-based routing via api_gateway`,
        },
        {
          id: 'connecting-to-cluster',
          heading: 'Connecting to the Cluster',
          paragraphs: [
            'With the cluster provisioned, `kubectl` is pointed at it by updating the local kubeconfig, which registers a new context for `artevier-eks-cluster` and confirms the worker nodes are `Ready`.',
          ],
          image: 'assets/img/artevier/kubectl_connect.jpg',
          imageCaption: 'Connected to artevier-eks-cluster, nodes Ready',
          codeBlock: `aws eks update-kubeconfig --region eu-west-3 --name artevier-eks-cluster
kubectl get nodes`,
        },
        {
          id: 'alb-controller-helm',
          heading: 'Installing the AWS Load Balancer Controller',
          paragraphs: [
            'Installed via `helm upgrade --install` against the `eks/aws-load-balancer-controller` chart into `kube-system`, using the IRSA-annotated service account, cluster name, region, and VPC ID from the Terraform outputs.',
          ],
          image: 'assets/img/artevier/Install_AWS_Load_Balancer_Controller.jpg',
          imageCaption: 'AWS Load Balancer Controller installed via Helm',
          codeBlock: `helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm upgrade --install aws-load-balancer-controller eks/aws-load-balancer-controller \\
  -f helm/controllers/aws-load-balancer-controller-values.yaml -n kube-system`,
        },
        {
          id: 'verifying-alb-controller',
          heading: 'Verifying the Load Balancer Controller',
          paragraphs: [
            'The controller comes up with 2 replicas running in `kube-system`, giving it its own HA setup independent of any single node.',
          ],
          image:
            'assets/img/artevier/kubectl_get_pods_-n_kube-system_findstr_aws-load-balancer.jpg',
          imageCaption: 'AWS Load Balancer Controller: 2/2 pods Running',
          codeBlock: `kubectl get pods -n kube-system | findstr aws-load-balancer`,
        },
        {
          id: 'installing-eso',
          heading: 'Installing External Secrets Operator',
          paragraphs: [
            'External Secrets Operator (ESO) deploys via Helm into its own dedicated namespace, using the IRSA-annotated `external-secrets` service account so it authenticates to AWS through the IAM role from Terraform rather than static credentials.',
          ],
          image:
            'assets/img/artevier/Use_the_correct_relative_path_from_where_you_are.jpg',
          imageCaption: 'External Secrets Operator deployed via Helm',
          codeBlock: `helm install external-secrets external-secrets/external-secrets \\
  -f helm/controllers/external-secrets-values.yaml -n external-secrets --create-namespace`,
        },
        {
          id: 'verifying-eso',
          heading: 'Verifying External Secrets Operator',
          paragraphs: [
            'All three ESO components, the main controller, the cert-controller, and the admission webhook, come up `Running` in the `external-secrets` namespace.',
          ],
          image: 'assets/img/artevier/external-secrets.jpg',
          imageCaption: 'External Secrets Operator: all 3 pods Running',
          codeBlock: `kubectl get pods -n external-secrets`,
        },
        {
          id: 'applying-external-secrets',
          heading: 'Applying the Per-Service ExternalSecrets',
          paragraphs: [
            'A dedicated `artevier` namespace is created, then 6 `ExternalSecret` manifests are applied, one per microservice, each pointing at its own path under `artevier/dev/*` in AWS Secrets Manager through the shared `ClusterSecretStore`.',
          ],
          image:
            'assets/img/artevier/Apply_the_per-service_ExternalSecrets.jpg',
          imageCaption: '6 ExternalSecret resources created, one per service',
          codeBlock: `kubectl create namespace artevier
kubectl apply -f helm/controllers/external-secrets/
kubectl get externalsecret -n artevier`,
        },
        {
          id: 'pushing-secret-values',
          heading: 'Pushing Real Secret Values to AWS Secrets Manager',
          paragraphs: [
            'Real secret values are pushed per service with `aws secretsmanager put-secret-value`, database URIs, the shared JWT secret, and SMTP credentials, each producing its own secret ARN and version ID.',
            'Once the values land in Secrets Manager, ESO syncs them automatically: every `ExternalSecret` flips to `SecretSynced` / `Ready: True`, confirming the full chain works end-to-end, IAM role → IRSA → ClusterSecretStore → AWS Secrets Manager → Kubernetes Secret.',
          ],
          image: 'assets/img/artevier/setting_secrets.jpg',
          imageCaption:
            'Secrets pushed to AWS Secrets Manager, all 6 ExternalSecrets SecretSynced',
          codeBlock: `aws secretsmanager put-secret-value --secret-id artevier/dev/api-gateway --secret-string "{...}" --region eu-west-3
aws secretsmanager put-secret-value --secret-id artevier/dev/user-service --secret-string "{...}" --region eu-west-3
aws secretsmanager put-secret-value --secret-id artevier/dev/product-service --secret-string "{...}" --region eu-west-3
aws secretsmanager put-secret-value --secret-id artevier/dev/order-service --secret-string "{...}" --region eu-west-3
aws secretsmanager put-secret-value --secret-id artevier/dev/notification-service --secret-string "{...}" --region eu-west-3
aws secretsmanager put-secret-value --secret-id artevier/dev/frontend --secret-string "{...}" --region eu-west-3

kubectl get externalsecret -n artevier`,
        },
        {
          id: 'deploying-app-chart',
          heading: 'Deploying the Application Chart',
          paragraphs: [
            'With the controllers running and secrets synced, the Artevier chart installs cleanly into its own namespace using the dev values file with the real ECR image references.',
          ],
          image: 'assets/img/artevier/chart.jpg',
          imageCaption: 'Artevier application chart deployed',
          codeBlock: `helm install artevier .\\helm\\artevier -f helm\\artevier\\values-dev.yaml -n artevier`,
        },
        {
          id: 'verifying-pods-ingress',
          heading: 'Verifying Pods & the Live Ingress',
          paragraphs: [
            'All 7 workloads, 6 microservices plus the `mongo-0` StatefulSet, come up `Running`. The AWS Load Balancer Controller automatically provisions a real internet-facing ALB from the Ingress resource, and the hostname shows up directly in `kubectl get ingress`, no manual load balancer setup required.',
          ],
          image: 'assets/img/artevier/Ingress.jpg',
          imageCaption:
            'All 7 pods Running, Ingress bound to a live ALB address',
          codeBlock: `kubectl get pods -n artevier
kubectl get ingress -n artevier`,
        },
        {
          id: 'testing-live-app',
          heading: 'Testing the Live App',
          paragraphs: [
            'Hitting the ALB address in the browser loads the live storefront, fully French-localized. A full registration → login → dashboard flow completes successfully against the real MongoDB-backed `user-service`, confirming the entire path from frontend to database works end-to-end on the deployed cluster.',
          ],
          image: 'assets/img/artevier/succ_register.jpg',
          imageCaption:
            'Registered and logged in on the live ALB, dashboard rendering correctly',
        },
      ],
    },
    {
      key: 'autoscaling',
      label: 'Autoscaling',
      pageTitle: 'Artevier: Autoscaling with Karpenter',
      articleReadTime: '6 min read',
      articleBlocks: [
        {
          id: 'karpenter-iam',
          heading: 'Karpenter IAM (`modules/karpenter`)',
          paragraphs: [
            'Karpenter gets its own dedicated module, since it needs two distinct identities: a node-level identity for the EC2 instances it launches, and a controller-level identity for the Karpenter pod itself.',
            'The node role trusts EC2 and carries four policy attachments: worker node policy, CNI policy, ECR read-only, and <span class="highlight-tech">SSM</span> (so Session Manager can reach Karpenter-launched nodes without SSH), wrapped in an instance profile.',
            "The controller role trusts the cluster's OIDC provider, scoped to `system:serviceaccount:kube-system:karpenter`. Its custom policy covers EC2 provisioning and lifecycle actions, describe calls, pricing reads, SSM AMI lookups, a scoped `iam:PassRole`, EKS describe, and instance profile management.",
          ],
          codeBlock: `Identity            Trust               Policies / Attachments
Node role           ec2.amazonaws.com   AmazonEKSWorkerNodePolicy, AmazonEKS_CNI_Policy,
                                          AmazonEC2ContainerRegistryReadOnly, AmazonSSMManagedInstanceCore
                                          + wrapped in an instance profile

Controller role      OIDC (IRSA),        Custom (templatefile()): EC2 provisioning/lifecycle,
                     scoped to           describe actions, pricing reads, SSM AMI lookup,
                     kube-system/        scoped iam:PassRole, EKS describe,
                     karpenter SA        instance profile management`,
        },
        {
          id: 'installing-karpenter',
          heading: 'Installing Karpenter',
          paragraphs: [
            'Karpenter is distributed as an OCI Helm chart and installs directly from `oci://public.ecr.aws/karpenter/karpenter` at a pinned version, using the IRSA-annotated `karpenter` service account.',
          ],
          image: 'assets/img/artevier/karpenter.jpg',
          imageCaption: 'Karpenter deployed via Helm, controller pod Running',
          codeBlock: `helm upgrade --install karpenter oci://public.ecr.aws/karpenter/karpenter \\
  --version 1.0.6 -f helm/controllers/karpenter/karpenter-values.yaml -n kube-system`,
        },
        {
          id: 'karpenter-nodeclass-nodepool',
          heading: 'Defining the EC2NodeClass & NodePool',
          paragraphs: [
            'An <span class="highlight-tech">EC2NodeClass</span> named `artevier-spot` defines what kind of nodes Karpenter is allowed to launch: AL2023 AMI family, the Karpenter node IAM role, and subnet/security-group discovery through the `karpenter.sh/discovery=artevier-eks-cluster` tag.',
            'A <span class="highlight-tech">NodePool</span> named `artevier-spot-pool` constrains what Karpenter provisions: Spot capacity only, `t` and `m` instance families, small-through-large sizes, an 8 vCPU / 16Gi total resource limit, and aggressive consolidation (`WhenEmptyOrUnderutilized`, checked every 1 minute).',
          ],
          image:
            'assets/img/artevier/Apply_Karpenter_s_EC2NodeClass___NodePool.jpg',
          imageCaption: 'EC2NodeClass and NodePool applied, both Ready',
          codeBlock: `kubectl apply -f helm/controllers/karpenter/ec2nodeclass.yaml
kubectl get ec2nodeclass
kubectl get nodepool`,
        },
        {
          id: 'autoscaling-proof',
          heading: 'Karpenter Provisioning a Node in Practice',
          paragraphs: [
            "With the NodePool in place, Karpenter provisions real capacity on demand: the cluster scaled from 2 nodes to 3, and the new node was immediately usable, a fresh `node-exporter` pod from the monitoring stack's DaemonSet scheduled onto it within seconds of it joining.",
          ],
          image: 'assets/img/artevier/autoscaling.jpg',
          imageCaption:
            'Cluster scaled from 2 to 3 nodes, monitoring DaemonSet extended automatically',
          codeBlock: `kubectl get nodes
kubectl get pods -n monitoring`,
        },
        {
          id: 'design-decisions-status',
          heading: 'Design Decisions & Current Status',
          paragraphs: [
            'Node capacity is <span class="highlight-tech">Spot-only</span>, a deliberate trade-off for a test/dev environment where cost matters more than guaranteed availability.',
            'The full Terraform plan applied cleanly, the EKS control plane and managed node group are both live, the OIDC provider and cluster security group discovery tag are in place, the EBS CSI driver addon is running, and Karpenter is installed and confirmed provisioning real infrastructure on demand.',
          ],
          codeBlock: `Capacity type       Spot only
Environment         dev / test
Cluster status       artevier-eks-cluster - live
EBS CSI addon        Live (aws-ebs-csi-driver)
Karpenter             Live, scaling 2 -> 3 nodes on demand`,
        },
      ],
    },
    {
      key: 'monitoring',
      label: 'Monitoring',
      pageTitle: 'Artevier: Monitoring with Prometheus & Grafana',
      articleReadTime: '4 min read',
      articleBlocks: [
        {
          id: 'grafana-overview',
          heading: 'Kubernetes Cluster Monitoring Dashboard',
          paragraphs: [
            'Observability is a critical part of operating Kubernetes workloads in production. Artevier uses the kube-prometheus-stack to collect, store, and visualize infrastructure and application metrics across the Amazon EKS cluster.',
            'The dashboard below provides a live overview of CPU utilisation, memory consumption, namespace activity, resource requests, and workload health. It confirms that Prometheus is successfully scraping metrics from the cluster and that the Artevier namespace is continuously monitored alongside the Kubernetes system components.',
          ],
          image: 'assets/img/artevier/grafana_cluster_monitoring_dashboard.jpg',
          imageCaption:
            'Grafana Kubernetes Cluster dashboard showing real-time CPU, memory, namespace and workload metrics collected from the Artevier Amazon EKS deployment.',
        },
        {
          id: 'installing-monitoring-stack',
          heading: 'Installing kube-prometheus-stack',
          paragraphs: [
            'Monitoring runs through the community `kube-prometheus-stack` Helm chart, which bundles Prometheus, Grafana, kube-state-metrics, and node-exporter into a single coordinated release, installed into its own `monitoring` namespace with Alertmanager disabled for this environment.',
          ],
          image: 'assets/img/artevier/add_grafana_1.jpg',
          imageCaption: 'kube-prometheus-stack deployed via Helm',
          codeBlock: `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update
helm install monitoring prometheus-community/kube-prometheus-stack \\
  -f helm/controllers/monitoring/values.yaml -n monitoring --create-namespace`,
        },
        {
          id: 'verifying-monitoring-stack',
          heading: 'Verifying the Monitoring Stack',
          paragraphs: [
            "Grafana, the Prometheus Operator, kube-state-metrics, and node-exporter all come up `Running` across the cluster's nodes, with the Prometheus server itself scheduling shortly after.",
          ],
          image: 'assets/img/artevier/add_grafana_2.jpg',
          imageCaption:
            'Monitoring stack pods coming online in the monitoring namespace',
          codeBlock: `kubectl get pods -n monitoring`,
        },
        {
          id: 'accessing-grafana',
          heading: 'Accessing Grafana',
          paragraphs: [
            'Grafana runs as a `ClusterIP` service with no public exposure. The admin password is retrieved from the Kubernetes Secret Helm generated, then the dashboard is reached locally through `kubectl port-forward`.',
          ],
          codeBlock: `kubectl --namespace monitoring get secrets monitoring-grafana \\
  -o jsonpath="{.data.admin-password}" | base64 -d ; echo

export POD_NAME=$(kubectl --namespace monitoring get pod \\
  -l "app.kubernetes.io/name=grafana,app.kubernetes.io/instance=monitoring" -oname)
kubectl --namespace monitoring port-forward $POD_NAME 3000`,
        },
      ],
    },
    {
      key: 'live-testing',
      label: 'Live Testing',
      pageTitle: 'Artevier: Live End-to-End Testing',
      articleReadTime: '3 min read',
      articleBlocks: [
        {
          id: 'user-registration-flow',
          heading: 'End-to-End User Registration & Database Synchronisation',
          paragraphs: [
            'This recording demonstrates the complete registration flow against the live Kubernetes deployment. A new customer account is created through the Angular frontend, routed through the API Gateway to the User Service, validated, hashed, and persisted in MongoDB.',
            'Immediately afterwards the MongoDB collection is inspected to verify that the newly created document exists, confirming successful end-to-end communication between the frontend, API Gateway, Kubernetes services, and the database.',
          ],
          video: 'assets/video/artevier/signup_database_sync.mp4',
          imageCaption: 'Live registration flow and MongoDB verification',
        },
        {
          id: 'admin-features',
          heading: 'Admin Dashboard & Management Features',
          paragraphs: [
            'This recording demonstrates the administrator workflow after authentication. Products, users and orders are managed through the protected administration interface, exercising multiple backend microservices behind the API Gateway.',
            'The demonstration confirms that role-based authorization, CRUD operations and service-to-service communication function correctly on the deployed Kubernetes cluster.',
          ],
          video: 'assets/video/artevier/admin_panel_demo.mp4',
          imageCaption: 'Live demonstration of the administration interface',
        },
      ],
    },
{
  key: 'cicd',
  label: 'CI/CD: Jenkins',
  pageTitle: 'Artevier: Jenkins Pipeline',
  articleReadTime: '6 min read',
  articleBlocks: [
    {
      id: 'jenkins-on-kubernetes',
      heading: 'Jenkins Running Inside the Cluster',
      paragraphs: [
        'Instead of maintaining a dedicated virtual machine, the Jenkins controller runs directly inside the <span class="highlight-tech">Amazon EKS</span> cluster as a single-replica <span class="highlight-tech">StatefulSet</span> deployed with Helm. A PersistentVolume backed by Amazon EBS preserves Jenkins configuration, plugins, and build history across pod restarts.',
        'The initial administrator account is provisioned automatically through <span class="highlight-tech">Jenkins Configuration as Code (JCasC)</span>, allowing the controller to be recreated entirely from code rather than manual UI configuration.',
      ],
      image: 'assets/img/artevier/jenkins_login.jpg',
      imageCaption:
        'Jenkins controller deployed on Amazon EKS with a JCasC-provisioned administrator account.',
    },

    {
      id: 'dynamic-kubernetes-agents',
      heading: 'Ephemeral Kubernetes Build Agents',
      paragraphs: [
        'Pipeline executions never run on the controller itself. The Jenkins Kubernetes plugin provisions a temporary agent pod for every build and removes it automatically after completion, ensuring clean and isolated build environments.',
        'Each agent pod contains multiple specialized containers sharing a common workspace through an <span class="highlight-tech">emptyDir</span> volume. Each pipeline stage executes inside the container best suited for that task.',
      ],
      codeBlock: `containers:
- name: jnlp      # Jenkins inbound agent
- name: node      # npm install / npm ci
- name: kaniko    # Container image builds
- name: aws       # AWS CLI
- name: tools     # kubectl + helm`,
    },

    {
      id: 'kaniko-builds',
      heading: 'Daemonless Image Builds with Kaniko',
      paragraphs: [
        'Because Kubernetes worker nodes do not expose a Docker daemon to build pods, container images are built using <span class="highlight-tech">Kaniko</span>. This removes the need for Docker-in-Docker or privileged containers while remaining fully Kubernetes-native.',
        'During every pipeline execution, Kaniko builds and pushes six container images (five backend microservices and one frontend) directly to their respective Amazon ECR repositories using the Jenkins build number as the image tag.',
      ],
      codeBlock: `/kaniko/executor \\
  --context=\`pwd\`/backend \\
  --dockerfile=\`pwd\`/backend/\${svc}/Dockerfile \\
  --destination=\${ECR_REGISTRY}/artevier-\${imageName}:\${BUILD_NUMBER}`,
    },

    {
      id: 'pipeline-stages',
      heading: 'Pipeline Execution',
      paragraphs: [
        'The Jenkins pipeline performs source checkout, validates the repository structure, installs backend dependencies, builds and publishes all backend services, builds the frontend image, and finally deploys the application to Amazon EKS using Helm.',
        'The pipeline polls the source repository every five minutes. Once new commits are detected, the entire build and deployment process executes automatically without manual intervention.',
      ],
      image: 'assets/img/artevier/jenkins_build_success.jpg',
      imageCaption:
        'Successful Jenkins pipeline execution completing checkout, image builds, pushes to Amazon ECR, and deployment to Amazon EKS in just over two minutes.',
      codeBlock: `Stages
-------
Checkout
Verify Repository
Install Backend Dependencies
Build Backend Images
Build Frontend Image
Deploy to Amazon EKS`,
    },

    {
      id: 'helm-deployment',
      heading: 'Deploying with Helm',
      paragraphs: [
        'Application deployment is performed using <span class="highlight-tech">helm upgrade --install</span>. The pipeline waits until every Deployment, StatefulSet, and Service becomes healthy before reporting success, ensuring that a completed build always represents a functioning deployment.',
        'Earlier Helm revisions highlight the RBAC permissions and rollout issues encountered while developing the deployment process. Resolving these failures resulted in a repeatable and fully automated deployment pipeline.',
      ],
      image: 'assets/img/artevier/helm_history_artevier.jpg',
      imageCaption:
        'Helm release history illustrating the evolution from early deployment failures to a stable automated release process.',
      codeBlock: `helm upgrade --install artevier ./helm/artevier \\
  --namespace artevier \\
  --set image.tag=\${BUILD_NUMBER} \\
  --wait --timeout 5m`,
    },

    {
      id: 'cluster-health',
      heading: 'Final Cluster State',
      paragraphs: [
        'After deployment completes, the Jenkins controller continues running independently inside its own namespace while the Artevier application is deployed into a dedicated application namespace. Kubernetes reports every workload as healthy, demonstrating a successful end-to-end CI/CD pipeline.',
        'The application consists of six independently deployed services together with a MongoDB StatefulSet. All workloads reach the Ready state without rollout failures, confirming that the deployment completed successfully.',
      ],
      image: 'assets/img/artevier/cluster_health.jpg',
      imageCaption:
        'Final Kubernetes cluster state showing the Jenkins controller and all Artevier workloads successfully running after the automated deployment.',
    },
  ],
},
  ];

  active = this.sections[0].key;

  get activeSection(): DevopsSection {
    return this.sections.find((s) => s.key === this.active)!;
  }

  setActive(key: string) {
    this.active = key;
    this.articleStepIndex = 0;
    this.articleViewAll = false;
  }

  articleStepIndex = 0;
  articleViewAll = false;

  get currentArticleBlock(): ArticleBlock | undefined {
    return this.activeSection.articleBlocks[this.articleStepIndex];
  }

  nextArticleStep() {
    if (this.articleStepIndex < this.activeSection.articleBlocks.length - 1)
      this.articleStepIndex++;
  }

  prevArticleStep() {
    if (this.articleStepIndex > 0) this.articleStepIndex--;
  }

  setArticleStep(i: number) {
    this.articleStepIndex = i;
  }

  toggleViewAll() {
    this.articleViewAll = !this.articleViewAll;
  }
}