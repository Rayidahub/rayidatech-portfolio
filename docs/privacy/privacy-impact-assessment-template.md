# Rayida Tech — Data Protection Impact Assessment (DPIA) Template
**Framework:** Nigeria Data Protection Act (NDPA) 2023, Section 28 & NDPC Regulatory Guidance  
**Version:** 2026.1  
**Project / Feature Assessed:** _______________________  
**Lead Engineer / Assessor:** _______________________  
**Date of Assessment:** _______________________  

---

## 1. When a DPIA is Required
Under Section 28 of the NDPA 2023, a DPIA must be conducted prior to any processing activity that is likely to result in a **high risk** to the rights and freedoms of data subjects. Examples include:
- Deploying novel artificial intelligence algorithms that make automated decisions or generate predictive user profiles.
- Processing personal data on a large scale across multiple jurisdictions.
- Integrating public-facing authentication and user account databases for enterprise clients.
- Implementing biometric, geolocation, or real-time tracking capabilities.

---

## 2. DPIA Assessment Sections

### Section A: Project Description & Scope
1. **Feature / Project Name:**
2. **Business Purpose:**
3. **Data Flows:** (Describe how data will be collected, stored, transmitted, accessed, and deleted).
4. **Third-Party Sub-processors Involved:**

### Section B: Necessity & Proportionality Assessment
1. **Lawful Basis:** (Which lawful basis under Section 25 of the NDPA 2023 supports this processing?)
2. **Data Minimization:** (Are all data fields strictly necessary? Can any field be excluded without impacting core functionality?)
3. **Retention Limit:** (What is the exact lifespan of this data? What automated mechanism handles deletion?)

### Section C: Risk Identification & Threat Modeling

| Risk Description | Threat Vector | Likelihood (Low/Med/High) | Severity (Low/Med/High) | Overall Risk Rating |
| :--- | :--- | :--- | :--- | :--- |
| Unauthorized database access | Weak RLS or stolen API credentials | Low | High | **Medium** |
| Data leakage in transit | Unencrypted network requests | Low | High | **Low** (Enforced TLS 1.3) |
| Excessive data collection | Form fields not minimized | Med | Low | **Low** |
| Automated bot spam | Absence of rate limits or honeypot | Med | Med | **Medium** |

### Section D: Risk Mitigation Controls

| Identified Risk | Mitigation Control Implemented | Residual Risk | Approved By |
| :--- | :--- | :--- | :--- |
| Stolen credentials | Enforce server-side API keys, no `NEXT_PUBLIC_` secrets, zero credentials in client code | Very Low | Lead Engineer |
| Unauthorized database reads | Supabase Row-Level Security (RLS) policies; mutate only through authenticated Server Actions | Low | Security Desk |
| Inadvertent tracking | Gate telemetry with interactive Cookie Consent; default to blocked | Low | Privacy Architect |

### Section E: Compliance Sign-off
- **Lead Software Engineer Sign-off:** _______________________ Date: _________
- **Designated Privacy Officer Sign-off:** _______________________ Date: _________
- **Periodic Review Date:** _______________________
