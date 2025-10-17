### DevOps Mindset (Simple)
> DevOps is a way of working where the people who build software also help run it in production.
> Teams share responsibility, use the same tooling, and automate as much as possible.

### Roles In DevOps (Who does what)
> Developers:
> • Build features and fix bugs.
> • Ship via CI/CD, own on‑call for their service.
> • Design for operability (health checks, logs, metrics, traces).
>
> Ops/Platform/SRE:
> • Provide reliable pipelines and runtime platforms.
> • Standardize monitoring, alerting, security, and scaling.
> • Build self‑service infra ("paved road") so devs deploy safely.
>
> Outcome:
> • Devs own code and its life in prod.
> • Ops moves from firefighting to enabling platforms and guardrails.

### How DevOps Bridges The Gap
> Shared responsibility: delivery and reliability are everyone’s job.
> Automation as common language: CI/CD, IaC, repeatable releases.
> Fast feedback loops: prod health is visible to devs; infra impact visible to ops.
> Cross‑functional teams: problems solved within the product team, not bounced around.

### "You Build It, You Run It" (In Practice)
> The team that writes the service is accountable for it in prod (including on‑call).
> This drives better reliability, observability, and safer releases.

### Who Handles Deployments?
> Developers trigger deployments via automated pipelines (push → test → deploy).
> Ops/Platform engineers ensure the deployment system is reliable, secure, and scalable.

### Traditional vs DevOps (At a glance)
> Traditional: Dev writes → Ops runs → Dev fixes later.
> DevOps: Dev writes → Dev runs → Dev fixes now (on a platform built by Ops).

---

### Feature Flags (What & Why)
> A runtime switch to enable/disable features without redeploying.
> Can be global or targeted (cohort/region/percentage).
> Purpose: decouple deployment from release—ship anytime, expose when ready.
> Example: `new_checkout_flow_enabled` controls which checkout UI a user sees.

### Gradual Rollout (Risk control)
> Turn on a feature incrementally (e.g., 1% → 10% → 50% → 100%) and monitor.
> Implement via flags or traffic routing to reduce blast radius.

### Deploy vs Release (Not the same)
> Deploy: move code to production; it may be hidden behind flags.
> Release: expose functionality to users; a product decision (flags/config/canary).
> Traditional: deploy == release (big‑bang, risky rollbacks).
> DevOps: deploy often; release deliberately via flags/canaries.

### Benefits (Flags + DevOps)
> Safer deployments: shipping doesn’t automatically affect users.
> Business flexibility: choose release timing independently of deploys.
> Faster feedback: A/B or canary before full rollout.
> Dev ownership: disable a flag instead of full rollback at 2AM.
> Supports experimentation: limited cohorts, real‑time monitoring, quick iteration.

### CI/CD Pipeline (Typical)
> Source: code change triggers the pipeline.
> Build: compile/package artifacts (e.g., Docker image).
> Test: unit/integration/security/lint checks.
> Deploy: promote to environments via automated pipelines.
> Monitor: tie deployments to dashboards and alerts.

### Ops becomes more development‑focused (In practice)
> IaC via Git PRs (Terraform/CloudFormation/Ansible); versioned infra.
> Automate provisioning, deploys, rollbacks; CI/CD for infra changes.
> Observability as code (dashboards/alerts), not ad‑hoc configs.
> Partner with devs early on performance, scale, reliability.

### Developers become operationally aware (In practice)
> Understand runtime (containers/K8s/serverless) and constraints.
> Own deploys (blue/green, canary, rollback) through pipelines.
> Design for resilience (timeouts, retries, circuit breakers, rate limits).
> Build observability (logs/metrics/traces) and respond to alerts.
> Consider security and cost (IAM, secrets, efficient resource use).
