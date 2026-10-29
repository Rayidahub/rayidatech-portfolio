# Rayida Tech — Personal Data Breach Incident Response Plan
**Framework:** Nigeria Data Protection Act (NDPA) 2023, Section 40 & NDPC Incident Guidelines  
**Version:** 2026.1  
**Last Updated:** October 29, 2026  
**Incident Coordinator:** Raymond Gaius / Technical Privacy Desk  
**Emergency Contact:** info@rayidatech.name.ng  

---

## 1. Statutory Mandate
Under **Section 40 of the Nigeria Data Protection Act 2023**:
- When a personal data breach occurs that is likely to result in a risk to the rights and freedoms of individuals, Rayida Tech must notify the **Nigeria Data Protection Commission (NDPC)** **without undue delay and within seventy-two (72) hours** of becoming aware of the breach.
- When acting as a **Data Processor** for a client, Rayida Tech must notify the Data Controller **without undue delay (and within 48 hours)** to enable the Controller to fulfill its own statutory reporting obligations.
- Where a breach poses a *high risk* to data subjects, the affected data subjects must also be notified without undue delay.

---

## 2. Seven-Stage Incident Response Workflow

```
[ Stage 1: Identification & Detection ]
                  │
                  ▼
[ Stage 2: Immediate Containment & Isolation ]
                  │
                  ▼
[ Stage 3: Forensic Investigation & Scope Assessment ]
                  │
                  ▼
[ Stage 4: Risk Evaluation (Rights & Freedoms) ]
                  │
                  ▼
[ Stage 5: Statutory Notifications (NDPC / Controller / Users) ]
                  │
                  ▼
[ Stage 6: Remediation & Security Hardening ]
                  │
                  ▼
[ Stage 7: Post-Incident Review & Documentation ]
```

---

## 3. Detailed Stage Breakdown

### Stage 1: Identification & Detection
- **Sources:** Server-side anomaly alerts (Vercel, Supabase), rate-limiting tripwires, failed authorization spikes, external vulnerability disclosure, or client notifications.
- **Initial Action:** Triage within **2 hours** of discovery. Record initial timestamp, systems affected, and nature of the suspected anomaly.

### Stage 2: Immediate Containment & Isolation
- **Technical Actions:**
  - Revoke compromised API keys (`RESEND_API_KEY`, Supabase service keys).
  - Terminate affected administrative sessions (`auth.users`).
  - Deploy edge firewall rules or IP blacklists via Next.js middleware / Vercel firewall.
  - Temporarily restrict affected database table mutations.

### Stage 3: Investigation & Scope Assessment
- Identify the exact categories of data subjects and records involved (e.g. contact inquiries, emails, telemetry).
- Determine whether data was accessed, extracted, altered, or destroyed.
- Ascertain whether data was protected by robust encryption (e.g. TLS 1.3, AES-256).

### Stage 4: Risk Evaluation
- Assess the likelihood and severity of potential adverse effects on individuals (identity theft, financial fraud, reputational damage, harassment).
- Determine if the breach meets the threshold requiring statutory NDPC notification.

### Stage 5: Statutory Notifications (72-Hour & 48-Hour Timers)
1. **Processor Engagements:** If the incident affects client-controlled data, notify the Controller within **48 hours** with a written preliminary incident report.
2. **Controller Engagements (Direct Portfolio Breach):** If personal data under Rayida Tech control is compromised with risk to individuals:
   - File official breach notification to the **NDPC** at `info@ndpc.gov.ng` / `ndpc.gov.ng` within **72 hours**.
   - Include: Nature of breach, categories and approximate number of data subjects, contact point for inquiries, likely consequences, and remediation measures taken.
3. **Data Subject Notification:** If high risk exists, notify affected individuals via email directly in clear and plain language.

### Stage 6: Remediation & Hardening
- Patch underlying code vulnerabilities, rotate all production secrets, review access logs, and deploy regression unit tests.

### Stage 7: Post-Incident Review & Documentation
- Prepare comprehensive Post-Incident Review (PIR) within 5 business days.
- Retain complete incident logs in the internal confidential compliance vault for a minimum of 5 years.
