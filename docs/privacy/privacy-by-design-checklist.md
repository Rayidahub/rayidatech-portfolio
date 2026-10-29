# Rayida Tech — Privacy by Design & Default Engineering Checklist
**Framework:** Nigeria Data Protection Act (NDPA) 2023, Section 39 & ISO/IEC 27701 Alignment  
**Target:** Engineering, Architecture, and Product Design Workflows  
**Last Updated:** October 29, 2026  

---

## 1. Principles of Privacy by Design
Rayida Tech embeds privacy into the software development lifecycle from initial architecture through deployment.

---

## 2. Pre-Release Engineering Checklist

### A. Data Minimization & Collection
- [ ] **Necessity Check:** Does this form or API route strictly require all requested fields? (If a field is merely "nice to have", remove it).
- [ ] **No Hidden Marketing Opt-ins:** Is marketing consent separate from contact inquiries? (No pre-ticked checkboxes).
- [ ] **Field Length Limits:** Are all user text inputs constrained by explicit max-length bounds on both client and server?

### B. Input Validation & Injection Hardening
- [ ] **Email Sanitization:** Are email inputs validated against strict regex (`EMAIL_REGEX`) and stripped of all carriage returns (`\r`) and line feeds (`\n`) to prevent email header injection?
- [ ] **HTML Escaping:** Are all dynamic user strings passed to transactional email templates escaped using HTML entity encoding?
- [ ] **Parameterized Storage:** Are all database queries executed through parameterized ORMs / Supabase client SDKs to prevent SQL injection?

### C. Cookie Consent & Telemetry Gating
- [ ] **Consent Prior to Execution:** Are non-essential cookies and analytics scripts (`ActivityTracker`) gated by `hasConsentedTo('analytics')`?
- [ ] **Consent Withdrawal:** Does the application immediately halt tracking if a user modifies their preference to "Reject Non-Essential"?
- [ ] **Zero Ad Pixels:** Verify that no third-party advertising scripts or tracking pixels are bundled into public pages.

### D. Authentication, Secrets & Authorization
- [ ] **Server Actions Guarded:** Does every mutating Server Action invoke `await requireAdminSession()` before executing?
- [ ] **Zero Client Secrets:** Verify that no secret keys (`RESEND_API_KEY`, Supabase service role keys) are prefixed with `NEXT_PUBLIC_` or bundled in client-side code.
- [ ] **Row-Level Security:** Is Row-Level Security (RLS) enabled and verified on all Supabase production tables?

### E. Rate Limiting & Anti-Abuse
- [ ] **Sliding Window Limiter:** Are all public mutation and submission endpoints protected by IP rate limiters?
- [ ] **Honeypot Protection:** Does the contact form include a hidden honeypot trap to silently drop automated bot spam?
